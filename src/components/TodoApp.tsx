import { useState, useMemo } from 'react';
import { Task, TaskFilters, Category, TaskStatus } from '@/types/todo';
import { TaskForm } from './TaskForm';
import { TaskList } from './TaskList';
import { TaskFilters as TaskFiltersComponent } from './TaskFilters';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Target, Sparkles } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import todoHero from '@/assets/todo-hero.jpg';

export const TodoApp = () => {
  const { toast } = useToast();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filters, setFilters] = useState<TaskFilters>({});
  const [isFormOpen, setIsFormOpen] = useState(false);

  // Default categories
  const [categories] = useState<Category[]>([
    { id: '1', name: 'general', createdAt: new Date() },
    { id: '2', name: 'work', createdAt: new Date() },
    { id: '3', name: 'personal', createdAt: new Date() },
    { id: '4', name: 'health', createdAt: new Date() },
    { id: '5', name: 'learning', createdAt: new Date() },
  ]);

  const createTask = (taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newTask: Task = {
      ...taskData,
      id: Date.now().toString(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    setTasks(prev => [newTask, ...prev]);
    toast({
      title: "Task created!",
      description: `"${taskData.title}" has been added to your tasks.`,
    });
  };

  const updateTaskStatus = (id: string, status: TaskStatus) => {
    setTasks(prev => prev.map(task => {
      if (task.id === id) {
        const updatedTask = {
          ...task,
          status,
          updatedAt: new Date(),
          completedAt: status === 'completed' ? new Date() : undefined,
        };
        
        // Show toast for status changes
        const statusMessages = {
          'pending': 'Task moved to pending',
          'in-progress': 'Task is now in progress',
          'completed': 'Task completed! 🎉'
        };
        
        toast({
          title: statusMessages[status],
          description: `"${task.title}" status updated.`,
        });
        
        return updatedTask;
      }
      return task;
    }));
  };

  const deleteTask = (id: string) => {
    const task = tasks.find(t => t.id === id);
    setTasks(prev => prev.filter(task => task.id !== id));
    
    if (task) {
      toast({
        title: "Task deleted",
        description: `"${task.title}" has been removed.`,
        variant: "destructive",
      });
    }
  };

  const stats = useMemo(() => {
    const total = tasks.length;
    const completed = tasks.filter(t => t.status === 'completed').length;
    const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;
    
    return { total, completed, completionRate };
  }, [tasks]);

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-10"
          style={{ backgroundImage: `url(${todoHero})` }}
        />
        <div className="relative z-10 container mx-auto px-4 py-12">
          <div className="text-center space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full border border-primary/20">
              <Sparkles className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium text-primary">Organize Your Life</span>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
              Smart Todo Manager
            </h1>
            
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Create, organize, and track your tasks with beautiful design and powerful features. 
              Stay productive and achieve your goals.
            </p>

            {stats.total > 0 && (
              <div className="flex items-center justify-center gap-8 text-sm">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">{stats.total}</div>
                  <div className="text-muted-foreground">Total Tasks</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-success">{stats.completed}</div>
                  <div className="text-muted-foreground">Completed</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary-glow">{stats.completionRate}%</div>
                  <div className="text-muted-foreground">Success Rate</div>
                </div>
              </div>
            )}

            <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
              <DialogTrigger asChild>
                <Button size="lg" className="gradient-primary transition-bounce hover:scale-105 shadow-elegant">
                  <Plus className="h-5 w-5 mr-2" />
                  Create Your First Task
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <TaskForm
                  onSubmit={createTask}
                  categories={categories}
                  onClose={() => setIsFormOpen(false)}
                />
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8 space-y-8">
        {/* Quick Add Button for existing users */}
        {tasks.length > 0 && (
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Target className="h-5 w-5 text-primary" />
              <h2 className="text-2xl font-bold text-foreground">Your Tasks</h2>
            </div>
            
            <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
              <DialogTrigger asChild>
                <Button className="gradient-primary transition-bounce hover:scale-105">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Task
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <TaskForm
                  onSubmit={createTask}
                  categories={categories}
                  onClose={() => setIsFormOpen(false)}
                />
              </DialogContent>
            </Dialog>
          </div>
        )}

        {/* Filters */}
        {tasks.length > 0 && (
          <TaskFiltersComponent
            filters={filters}
            categories={categories}
            onFiltersChange={setFilters}
          />
        )}

        {/* Task List */}
        <TaskList
          tasks={tasks}
          filters={filters}
          onStatusChange={updateTaskStatus}
          onDelete={deleteTask}
        />

        {/* Getting Started Card for Empty State */}
        {tasks.length === 0 && (
          <Card className="gradient-card shadow-elegant animate-fade-in">
            <CardContent className="p-8 text-center space-y-4">
              <Target className="h-16 w-16 text-primary mx-auto opacity-50" />
              <h3 className="text-2xl font-semibold text-card-foreground">Ready to get organized?</h3>
              <p className="text-muted-foreground max-w-md mx-auto">
                Start by creating your first task. You can add descriptions, set priorities, 
                choose categories, and set due dates to stay on top of everything.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8 text-sm">
                <div className="p-4 bg-primary/5 rounded-lg border border-primary/10">
                  <h4 className="font-semibold text-primary mb-2">📝 Create Tasks</h4>
                  <p className="text-muted-foreground">Add titles, descriptions, and due dates</p>
                </div>
                <div className="p-4 bg-primary/5 rounded-lg border border-primary/10">
                  <h4 className="font-semibold text-primary mb-2">🎯 Set Priorities</h4>
                  <p className="text-muted-foreground">Organize by high, medium, or low priority</p>
                </div>
                <div className="p-4 bg-primary/5 rounded-lg border border-primary/10">
                  <h4 className="font-semibold text-primary mb-2">📊 Track Progress</h4>
                  <p className="text-muted-foreground">Move tasks through pending, in progress, and completed</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};