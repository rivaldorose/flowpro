import React, { useState } from 'react';
import { StickyNote } from 'lucide-react';
import BaseCard from './BaseCard';
import { Textarea } from '@/components/ui/textarea';

const colors = [
  { bg: 'bg-yellow-100', border: 'border-yellow-300', text: 'text-yellow-900' },
  { bg: 'bg-pink-100', border: 'border-pink-300', text: 'text-pink-900' },
  { bg: 'bg-blue-100', border: 'border-blue-300', text: 'text-blue-900' },
  { bg: 'bg-green-100', border: 'border-green-300', text: 'text-green-900' },
  { bg: 'bg-purple-100', border: 'border-purple-300', text: 'text-purple-900' },
];

/**
 * Note Card - Sticky note style card
 */
export default function NoteCard({ 
  id, 
  x, 
  y, 
  width = 250, 
  height = 250,
  content = '', 
  colorIndex = 0,
  onUpdate, 
  onDelete, 
  ...props 
}) {
  const [text, setText] = useState(content);
  const color = colors[colorIndex % colors.length];

  const handleChange = (e) => {
    const newText = e.target.value;
    setText(newText);
    onUpdate?.({ id, content: newText });
  };

  return (
    <BaseCard
      id={id}
      type="note"
      x={x}
      y={y}
      width={width}
      height={height}
      onUpdate={onUpdate}
      onDelete={onDelete}
      className={`draggable ${color.bg} ${color.border} border-2 rotate-1`}
      {...props}
    >
      <div className="flex items-center gap-2 mb-2">
        <StickyNote className={`w-4 h-4 ${color.text}`} />
      </div>
      <Textarea
        value={text}
        onChange={handleChange}
        placeholder="Write a note..."
        className={`min-h-[180px] border-0 p-0 resize-none focus-visible:ring-0 bg-transparent ${color.text} placeholder:${color.text}/50 text-sm font-medium`}
        style={{ boxShadow: 'none' }}
      />
    </BaseCard>
  );
}

