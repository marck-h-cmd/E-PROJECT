'use client';

import * as React from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utilidades';

interface ItemAcordeon {
  id: string;
  titulo: string;
  contenido: React.ReactNode;
}

interface AcordeonProps {
  items: ItemAcordeon[];
  tipo?: 'single' | 'multiple';
  className?: string;
}

export function Acordeon({ items, tipo = 'single', className }: AcordeonProps) {
  const [itemsAbiertos, setItemsAbiertos] = React.useState<string[]>([]);

  const toggleItem = (id: string) => {
    if (tipo === 'single') {
      setItemsAbiertos(itemsAbiertos.includes(id) ? [] : [id]);
    } else {
      setItemsAbiertos(
        itemsAbiertos.includes(id)
          ? itemsAbiertos.filter((item) => item !== id)
          : [...itemsAbiertos, id]
      );
    }
  };

  return (
    <div className={cn('divide-y divide-gray-200 rounded-lg border', className)}>
      {items.map((item) => {
        const estaAbierto = itemsAbiertos.includes(item.id);
        return (
          <div key={item.id}>
            <button
              onClick={() => toggleItem(item.id)}
              className="flex w-full items-center justify-between px-4 py-3 text-left font-medium hover:bg-gray-50 transition-colors"
            >
              <span>{item.titulo}</span>
              <ChevronDown
                className={cn(
                  'h-5 w-5 transition-transform',
                  estaAbierto && 'rotate-180'
                )}
              />
            </button>
            {estaAbierto && (
              <div className="border-t px-4 py-3 text-sm text-gray-600">
                {item.contenido}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}