import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { CalendarIcon, PlusIcon } from 'lucide-react';
import { Task, TaskPriority, Category } from '@/types/todo';

interface TaskFormProps {
  onSubmit: (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => void;
  categories: Category[];
  onClose?: () => void;
}

export const TaskForm = ({ onSubmit, categories, onClose }: TaskFormProps) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<TaskPriority>('medium');
  const [category, setCategory] = useState('');
  const [dueDate, setDueDate] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const newTask: Omit<Task, 'id' | 'createdAt' | 'updatedAt'> = {
      title: title.trim(),
      description: description.trim() || undefined,
      status: 'pending',
      priority,
      category: category || 'general',
      dueDate: dueDate ? new Date(dueDate) : undefined,
    };

    onSubmit(newTask);
    
    // Reset form
    setTitle('');
    setDescription('');
    setPriority('medium');
    setCategory('');
    setDueDate('');
    
    if (onClose) onClose();
  };

  return (
    <Card className="gradient-card shadow-elegant animate-slide-up">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <PlusIcon className="h-5 w-5 text-primary" />
          Create New Task
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Task Title</Label>
            <Input
              id="title"
              placeholder="Enter task title..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="transition-smooth focus:shadow-glow"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description (Optional)</Label>
            <Textarea
              id="description"
              placeholder="Add task description..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="resize-none transition-smooth focus:shadow-glow"
              rows={3}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="priority">Priority</Label>
              <Select value={priority} onValueChange={(value: TaskPriority) => setPriority(value)}>
                <SelectTrigger className="transition-smooth focus:shadow-glow">
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low Priority</SelectItem>
                  <SelectItem value="medium">Medium Priority</SelectItem>
                  <SelectItem value="high">High Priority</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger className="transition-smooth focus:shadow-glow">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat.id} value={cat.name}>
                      {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="dueDate">Due Date (Optional)</Label>
            <div className="relative">
              <Input
                id="dueDate"
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="transition-smooth focus:shadow-glow"
              />
              <CalendarIcon className="absolute right-3 top-3 h-4 w-4 text-muted-foreground pointer-events-none" />
            </div>
          </div>

          <div className="flex gap-2 pt-4">
            <Button type="submit" className="gradient-primary flex-1 transition-bounce hover:scale-105">
              Create Task
            </Button>
            {onClose && (
              <Button type="button" variant="outline" onClick={onClose} className="transition-smooth">
                Cancel
              </Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  );
};