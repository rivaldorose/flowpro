import React, { useState } from 'react';
import { X, GripVertical, MoreVertical } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

/**
 * Base Card component for all canvas cards
 * Provides drag handle, menu, and delete functionality
 */
export default function BaseCard({ 
  id, 
  type, 
  x = 0, 
  y = 0, 
  width = 300, 
  height = 'auto',
  children, 
  onDelete,
  onUpdate,
  onMouseDown,
  onMouseMove,
  onMouseUp,
  className = '',
  ...props 
}) {
  const [isDragging, setIsDragging] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const handleDelete = () => {
    if (onDelete) {
      onDelete(id);
    }
  };

  return (
    <div
      className={`
        absolute bg-white rounded-xl shadow-md border-2 border-transparent
        hover:border-purple-200 hover:shadow-lg transition-all
        group cursor-move
        ${isDragging ? 'z-50 scale-105' : 'z-10'}
        ${className}
      `}
      style={{
        left: `${x}px`,
        top: `${y}px`,
        width: typeof width === 'number' ? `${width}px` : width,
        height: typeof height === 'number' ? `${height}px` : height,
        minHeight: typeof height === 'number' ? `${height}px` : 'auto',
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onMouseDown={onMouseDown}
      onMouseMove={onMouseMove}
      onMouseUp={onMouseUp}
      {...props}
    >
      {/* Card Header */}
      <div className="flex items-center justify-between p-2 border-b border-gray-100 bg-gray-50/50 rounded-t-xl card-header">
        <div className="flex items-center gap-1 text-gray-400 group-hover:text-gray-600 grip-handle cursor-grab active:cursor-grabbing">
          <GripVertical className="w-4 h-4" />
        </div>
        <div className="flex items-center gap-1">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 text-gray-400 hover:text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <MoreVertical className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onUpdate?.({ id, duplicate: true })}>
                Duplicate
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleDelete} className="text-red-600">
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Card Content */}
      <div className="p-4">
        {children}
      </div>
    </div>
  );
}

