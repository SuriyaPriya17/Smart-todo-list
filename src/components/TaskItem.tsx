import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  CheckCircle2, 
  Circle, 
  Clock, 
  PlayCircle, 
  Calendar,
  MoreHorizontal,
  Trash2,
  Edit
} from 'lucide-react';
import { Task, TaskStatus } from '@/types/todo';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';

interface TaskItemProps {
  task: Task;
  onStatusChange: (id: string, status: TaskStatus) => void;
  onDelete: (id: string) => void;
  onEdit?: (task: Task) => void;
}

export const TaskItem = ({ task, onStatusChange, onDelete, onEdit }: TaskItemProps) => {
  const [isAnimating, setIsAnimating] = useState(false);

  const getStatusIcon = () => {
    switch (task.status) {
      case 'completed':
        return <CheckCircle2 className="h-5 w-5 text-success" />;
      case 'in-progress':
        return <PlayCircle className="h-5 w-5 text-primary" />;
      default:
        return <Circle className="h-5 w-5 text-muted-foreground" />;
    }
  };

  const getStatusColor = () => {
    switch (task.status) {
      case 'completed':
        return 'text-success';
      case 'in-progress':
        return 'text-primary';
      default:
        return 'text-muted-foreground';
    }
  };

  const getPriorityClass = () => {
    switch (task.priority) {
      case 'high':
        return 'priority-high';
      case 'medium':
        return 'priority-medium';
      case 'low':
        return 'priority-low';
      default:
        return '';
    }
  };

  const handleStatusToggle = () => {
    setIsAnimating(true);
    const nextStatus: TaskStatus = 
      task.status === 'pending' ? 'in-progress' :
      task.status === 'in-progress' ? 'completed' : 'pending';
    
    onStatusChange(task.id, nextStatus);
    
    setTimeout(() => setIsAnimating(false), 600);
  };

  const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && task.status !== 'completed';

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    }).format(date);
  };

  return (
    <Card className={cn(
      "gradient-card shadow-card transition-smooth hover:shadow-elegant",
      getPriorityClass(),
      task.status === 'completed' && "opacity-75",
      isAnimating && "animate-check-bounce"
    )}>
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleStatusToggle}
            className="p-0 h-auto hover:bg-transparent transition-bounce"
          >
            {getStatusIcon()}
          </Button>

          <div className="flex-1 min-w-0">
            <h3 className={cn(
              "font-semibold text-card-foreground transition-smooth",
              task.status === 'completed' && "line-through opacity-60"
            )}>
              {task.title}
            </h3>
            
            {task.description && (
              <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                {task.description}
              </p>
            )}

            <div className="flex items-center gap-2 mt-3 flex-wrap">
              <Badge 
                variant="outline" 
                className={cn("text-xs", getStatusColor())}
              >
                {task.status === 'in-progress' ? 'In Progress' : 
                 task.status === 'completed' ? 'Completed' : 'Pending'}
              </Badge>

              <Badge 
                variant="outline"
                className={cn(
                  "text-xs",
                  task.priority === 'high' && "border-priority-high text-priority-high",
                  task.priority === 'medium' && "border-priority-medium text-priority-medium",
                  task.priority === 'low' && "border-priority-low text-priority-low"
                )}
              >
                {task.priority} priority
              </Badge>

              {task.dueDate && (
                <div className={cn(
                  "flex items-center gap-1 text-xs",
                  isOverdue ? "text-destructive" : "text-muted-foreground"
                )}>
                  <Calendar className="h-3 w-3" />
                  <span>{formatDate(task.dueDate)}</span>
                  {isOverdue && <Clock className="h-3 w-3 ml-1" />}
                </div>
              )}

              <Badge variant="secondary" className="text-xs">
                {task.category}
              </Badge>
            </div>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="p-0 h-auto">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {onEdit && (
                <DropdownMenuItem onClick={() => onEdit(task)}>
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Task
                </DropdownMenuItem>
              )}
              <DropdownMenuItem 
                onClick={() => onDelete(task.id)}
                className="text-destructive focus:text-destructive"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete Task
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardContent>
    </Card>
  );
};