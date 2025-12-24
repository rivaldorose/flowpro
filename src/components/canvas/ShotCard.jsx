import React, { useState } from 'react';
import { Film, Camera, Video } from 'lucide-react';
import BaseCard from './BaseCard';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const shotTypes = [
  { value: 'wide', label: 'Wide Shot', icon: Camera },
  { value: 'medium', label: 'Medium Shot', icon: Camera },
  { value: 'close', label: 'Close Up', icon: Camera },
  { value: 'video', label: 'Video', icon: Video },
];

/**
 * Shot Card - Shot list item card
 */
export default function ShotCard({ 
  id, 
  x, 
  y, 
  width = 350,
  shotNumber = '', 
  shotType = 'medium',
  description = '',
  duration = '',
  onUpdate, 
  onDelete, 
  ...props 
}) {
  const [shotNum, setShotNum] = useState(shotNumber);
  const [type, setType] = useState(shotType);
  const [desc, setDesc] = useState(description);
  const [dur, setDur] = useState(duration);

  const handleShotNumChange = (e) => {
    const val = e.target.value;
    setShotNum(val);
    onUpdate?.({ id, shotNumber: val });
  };

  const handleTypeChange = (val) => {
    setType(val);
    onUpdate?.({ id, shotType: val });
  };

  const handleDescChange = (e) => {
    const val = e.target.value;
    setDesc(val);
    onUpdate?.({ id, description: val });
  };

  const handleDurChange = (e) => {
    const val = e.target.value;
    setDur(val);
    onUpdate?.({ id, duration: val });
  };

  const selectedType = shotTypes.find(t => t.value === type) || shotTypes[1];
  const TypeIcon = selectedType.icon;

  return (
    <BaseCard
      id={id}
      type="shot"
      x={x}
      y={y}
      width={width}
      onUpdate={onUpdate}
      onDelete={onDelete}
      className="draggable"
      {...props}
    >
      <div className="flex items-center gap-2 mb-3">
        <Film className="w-4 h-4 text-purple-600" />
        <Input
          value={shotNum}
          onChange={handleShotNumChange}
          placeholder="Shot #"
          className="w-20 border-0 p-0 h-auto font-bold text-lg bg-transparent focus-visible:ring-0"
          style={{ boxShadow: 'none' }}
        />
        <Select value={type} onValueChange={handleTypeChange}>
          <SelectTrigger className="w-32 h-8 text-xs">
            <SelectValue>
              <div className="flex items-center gap-1">
                <TypeIcon className="w-3 h-3" />
                {selectedType.label}
              </div>
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            {shotTypes.map((st) => {
              const Icon = st.icon;
              return (
                <SelectItem key={st.value} value={st.value}>
                  <div className="flex items-center gap-2">
                    <Icon className="w-4 h-4" />
                    {st.label}
                  </div>
                </SelectItem>
              );
            })}
          </SelectContent>
        </Select>
        {dur && (
          <Badge variant="outline" className="ml-auto">
            {dur}
          </Badge>
        )}
      </div>
      <Textarea
        value={desc}
        onChange={handleDescChange}
        placeholder="Shot description..."
        className="min-h-[80px] border-0 p-0 resize-none focus-visible:ring-0 text-sm"
        style={{ boxShadow: 'none' }}
      />
      <div className="mt-2">
        <Input
          value={dur}
          onChange={handleDurChange}
          placeholder="Duration (e.g., 5s)"
          className="h-8 text-xs border-gray-200"
        />
      </div>
    </BaseCard>
  );
}

