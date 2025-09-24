import { Task, TaskFilters } from '@/types/todo';
import { TaskItem } from './TaskItem';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, ListTodo, AlertCircle } from 'lucide-react';

interface TaskListProps {
  tasks: Task[];
  filters: TaskFilters;
  onStatusChange: (id: string, status: Task['status']) => void;
  onDelete: (id: string) => void;
  onEdit?: (task: Task) => void;
}

export const TaskList = ({ tasks, filters, onStatusChange, onDelete, onEdit }: TaskListProps) => {
  const filteredTasks = tasks.filter(task => {
    if (filters.status && task.status !== filters.status) return false;
    if (filters.priority && task.priority !== filters.priority) return false;
    if (filters.category && task.category !== filters.category) return false;
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      const matchesTitle = task.title.toLowerCase().includes(searchLower);
      const matchesDescription = task.description?.toLowerCase().includes(searchLower);
      if (!matchesTitle && !matchesDescription) return false;
    }
    return true;
  });

  const getTaskStats = () => {
    const total = filteredTasks.length;
    const completed = filteredTasks.filter(t => t.status === 'completed').length;
    const inProgress = filteredTasks.filter(t => t.status === 'in-progress').length;
    const pending = filteredTasks.filter(t => t.status === 'pending').length;
    
    return { total, completed, inProgress, pending };
  };

  const stats = getTaskStats();

  if (filteredTasks.length === 0) {
    return (
      <Card className="gradient-card shadow-card">
        <CardContent className="p-8 text-center">
          <ListTodo className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-card-foreground mb-2">
            {tasks.length === 0 ? 'No tasks yet' : 'No tasks match your filters'}
          </h3>
          <p className="text-muted-foreground">
            {tasks.length === 0 
              ? 'Create your first task to get started with organizing your work.'
              : 'Try adjusting your filters or search terms to find what you\'re looking for.'
            }
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Task Statistics */}
      <Card className="gradient-card shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ListTodo className="h-5 w-5 text-primary" />
            Task Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-card-foreground">{stats.total}</div>
              <div className="text-sm text-muted-foreground">Total</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-success">{stats.completed}</div>
              <div className="text-sm text-muted-foreground">Completed</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">{stats.inProgress}</div>
              <div className="text-sm text-muted-foreground">In Progress</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-warning">{stats.pending}</div>
              <div className="text-sm text-muted-foreground">Pending</div>
            </div>
          </div>
          
          {stats.total > 0 && (
            <div className="mt-4">
              <div className="flex justify-between text-sm text-muted-foreground mb-1">
                <span>Progress</span>
                <span>{Math.round((stats.completed / stats.total) * 100)}%</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-primary to-primary-glow h-2 rounded-full transition-all duration-500"
                  style={{ width: `${(stats.completed / stats.total) * 100}%` }}
                />
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Task List */}
      <div className="space-y-4">
        {filteredTasks
          .sort((a, b) => {
            // Sort by: overdue first, then by priority, then by due date, then by creation date
            const now = new Date();
            const aOverdue = a.dueDate && new Date(a.dueDate) < now && a.status !== 'completed';
            const bOverdue = b.dueDate && new Date(b.dueDate) < now && b.status !== 'completed';
            
            if (aOverdue && !bOverdue) return -1;
            if (!aOverdue && bOverdue) return 1;
            
            const priorityOrder = { high: 3, medium: 2, low: 1 };
            const priorityDiff = priorityOrder[b.priority] - priorityOrder[a.priority];
            if (priorityDiff !== 0) return priorityDiff;
            
            if (a.dueDate && b.dueDate) {
              return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
            }
            if (a.dueDate && !b.dueDate) return -1;
            if (!a.dueDate && b.dueDate) return 1;
            
            return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
          })
          .map((task, index) => (
            <div key={task.id} className="animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
              <TaskItem
                task={task}
                onStatusChange={onStatusChange}
                onDelete={onDelete}
                onEdit={onEdit}
              />
            </div>
          ))}
      </div>
    </div>
  );
};