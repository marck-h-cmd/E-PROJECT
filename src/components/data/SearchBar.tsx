'use client';

import { Search, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/cn';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  onSubmit?: () => void;
}

export function SearchBar({
  value,
  onChange,
  placeholder = 'Buscar...',
  className,
  onSubmit,
}: SearchBarProps) {
  return (
    <form
      className={cn('relative flex max-w-md gap-2', className)}
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit?.();
      }}
    >
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
        <Input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="pl-9"
        />
      </div>
      {value && (
        <Button type="button" variant="ghost" size="icon" onClick={() => onChange('')}>
          <X className="h-4 w-4" />
        </Button>
      )}
    </form>
  );
}
