import React, { useState } from 'react';
import { FileText } from 'lucide-react';
import BaseCard from './BaseCard';
import { Textarea } from '@/components/ui/textarea';

/**
 * Text Card - Simple text content card
 */
export default function TextCard({ id, x, y, width = 300, content = '', onUpdate, onDelete, ...props }) {
  const [text, setText] = useState(content);

  const handleChange = (e) => {
    const newText = e.target.value;
    setText(newText);
    onUpdate?.({ id, content: newText });
  };

  return (
    <BaseCard
      id={id}
      type="text"
      x={x}
      y={y}
      width={width}
      onUpdate={onUpdate}
      onDelete={onDelete}
      className="draggable"
      {...props}
    >
      <div className="flex items-start gap-2 mb-2">
        <FileText className="w-4 h-4 text-purple-600 mt-1 shrink-0" />
        <Textarea
          value={text}
          onChange={handleChange}
          placeholder="Enter text..."
          className="min-h-[100px] border-0 p-0 resize-none focus-visible:ring-0 focus-visible:ring-offset-0 text-sm"
          style={{ boxShadow: 'none' }}
        />
      </div>
    </BaseCard>
  );
}

