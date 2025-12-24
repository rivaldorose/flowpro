import React, { useState } from 'react';
import { Folder } from 'lucide-react';
import BaseCard from './BaseCard';
import { Input } from '@/components/ui/input';

/**
 * Section Card - Container/group for other cards
 */
export default function SectionCard({ 
  id, 
  x, 
  y, 
  width = 600, 
  height = 400,
  title = 'Section', 
  onUpdate, 
  onDelete, 
  children,
  ...props 
}) {
  const [sectionTitle, setSectionTitle] = useState(title);

  const handleTitleChange = (e) => {
    const newTitle = e.target.value;
    setSectionTitle(newTitle);
    onUpdate?.({ id, title: newTitle });
  };

  return (
    <BaseCard
      id={id}
      type="section"
      x={x}
      y={y}
      width={width}
      height={height}
      onUpdate={onUpdate}
      onDelete={onDelete}
      className="draggable bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200"
      {...props}
    >
      <div className="flex items-center gap-2 mb-4">
        <Folder className="w-4 h-4 text-purple-600" />
        <Input
          value={sectionTitle}
          onChange={handleTitleChange}
          placeholder="Section title..."
          className="border-0 p-0 h-auto font-semibold text-lg bg-transparent focus-visible:ring-0"
          style={{ boxShadow: 'none' }}
        />
      </div>
      <div className="relative w-full h-full min-h-[300px] bg-white/50 rounded-lg border border-purple-200/50 p-4">
        {children || (
          <div className="text-center text-gray-400 text-sm py-8">
            Drop cards here or add content
          </div>
        )}
      </div>
    </BaseCard>
  );
}

