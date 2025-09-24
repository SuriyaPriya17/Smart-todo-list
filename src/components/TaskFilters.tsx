import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { TaskFilters as TaskFiltersType, Category } from '@/types/todo';
import { Search, Filter, X } from 'lucide-react';

interface TaskFiltersProps {
  filters: TaskFiltersType;
  categories: Category[];
  onFiltersChange: (filters: TaskFiltersType) => void;
}

export const TaskFilters = ({ filters, categories, onFiltersChange }: TaskFiltersProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const updateFilter = (key: keyof TaskFiltersType, value: string | undefined) => {
    onFiltersChange({
      ...filters,
      [key]: value || undefined
    });
  };

  const clearFilters = () => {
    onFiltersChange({});
  };

  const hasActiveFilters = Object.values(filters).some(value => value);

  return (
    <Card className="gradient-card shadow-card">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5 text-primary" />
            Filters & Search
          </CardTitle>
          <div className="flex items-center gap-2">
            {hasActiveFilters && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearFilters}
                className="text-muted-foreground hover:text-foreground"
              >
                <X className="h-4 w-4 mr-1" />
                Clear
              </Button>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
              className="md:hidden"
            >
              {isExpanded ? 'Less' : 'More'}
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search tasks..."
            value={filters.search || ''}
            onChange={(e) => updateFilter('search', e.target.value)}
            className="pl-10 transition-smooth focus:shadow-glow"
          />
        </div>

        {/* Filter Controls */}
        <div className={`grid gap-4 transition-all duration-300 ${
          isExpanded ? 'grid-cols-1' : 'grid-cols-1 md:grid-cols-3'
        } ${!isExpanded && 'max-md:hidden'}`}>
          {/* Status Filter */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-card-foreground">Status</label>
            <Select
              value={filters.status || 'all'}
              onValueChange={(value) => updateFilter('status', value === 'all' ? undefined : value as any)}
            >
              <SelectTrigger className="transition-smooth focus:shadow-glow">
                <SelectValue placeholder="All statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="in-progress">In Progress</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Priority Filter */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-card-foreground">Priority</label>
            <Select
              value={filters.priority || 'all'}
              onValueChange={(value) => updateFilter('priority', value === 'all' ? undefined : value as any)}
            >
              <SelectTrigger className="transition-smooth focus:shadow-glow">
                <SelectValue placeholder="All priorities" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Priorities</SelectItem>
                <SelectItem value="high">High Priority</SelectItem>
                <SelectItem value="medium">Medium Priority</SelectItem>
                <SelectItem value="low">Low Priority</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Category Filter */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-card-foreground">Category</label>
            <Select
              value={filters.category || 'all'}
              onValueChange={(value) => updateFilter('category', value === 'all' ? undefined : value)}
            >
              <SelectTrigger className="transition-smooth focus:shadow-glow">
                <SelectValue placeholder="All categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.name}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Active Filters Display */}
        {hasActiveFilters && (
          <div className="flex flex-wrap gap-2 pt-2 border-t border-border">
            {filters.search && (
              <Badge variant="secondary" className="gap-1">
                Search: "{filters.search}"
                <button
                  onClick={() => updateFilter('search', undefined)}
                  className="ml-1 hover:bg-secondary-foreground/20 rounded-full p-0.5"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            )}
            {filters.status && (
              <Badge variant="secondary" className="gap-1">
                Status: {filters.status}
                <button
                  onClick={() => updateFilter('status', undefined)}
                  className="ml-1 hover:bg-secondary-foreground/20 rounded-full p-0.5"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            )}
            {filters.priority && (
              <Badge variant="secondary" className="gap-1">
                Priority: {filters.priority}
                <button
                  onClick={() => updateFilter('priority', undefined)}
                  className="ml-1 hover:bg-secondary-foreground/20 rounded-full p-0.5"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            )}
            {filters.category && (
              <Badge variant="secondary" className="gap-1">
                Category: {filters.category}
                <button
                  onClick={() => updateFilter('category', undefined)}
                  className="ml-1 hover:bg-secondary-foreground/20 rounded-full p-0.5"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};