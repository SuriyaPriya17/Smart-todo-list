export type TaskStatus = 'pending' | 'in-progress' | 'completed';
export type TaskPriority = 'low' | 'medium' | 'high';

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate?: Date;
  category: string;
  createdAt: Date;
  updatedAt: Date;
  completedAt?: Date;
}

export interface Category {
  id: string;
  name: string;
  color?: string;
  createdAt: Date;
}

export interface TaskFilters {
  status?: TaskStatus;
  priority?: TaskPriority;
  category?: string;
  search?: string;
}