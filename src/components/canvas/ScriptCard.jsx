import React, { useState } from 'react';
import { FileText, User } from 'lucide-react';
import BaseCard from './BaseCard';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

const sceneTypes = ['INT.', 'EXT.', 'INT./EXT.'];
const characterTypes = ['CHARACTER', 'NARRATOR', 'VOICE'];

/**
 * Script Card - Script scene/line card
 */
export default function ScriptCard({ 
  id, 
  x, 
  y, 
  width = 400,
  sceneType = 'INT.',
  location = '',
  timeOfDay = '',
  character = '',
  dialogue = '',
  action = '',
  onUpdate, 
  onDelete, 
  ...props 
}) {
  const [scene, setScene] = useState(sceneType);
  const [loc, setLoc] = useState(location);
  const [time, setTime] = useState(timeOfDay);
  const [char, setChar] = useState(character);
  const [dial, setDial] = useState(dialogue);
  const [act, setAct] = useState(action);

  const handleSceneChange = (e) => {
    const val = e.target.value;
    setScene(val);
    onUpdate?.({ id, sceneType: val });
  };

  const handleLocChange = (e) => {
    const val = e.target.value;
    setLoc(val);
    onUpdate?.({ id, location: val });
  };

  const handleTimeChange = (e) => {
    const val = e.target.value;
    setTime(val);
    onUpdate?.({ id, timeOfDay: val });
  };

  const handleCharChange = (e) => {
    const val = e.target.value;
    setChar(val);
    onUpdate?.({ id, character: val });
  };

  const handleDialChange = (e) => {
    const val = e.target.value;
    setDial(val);
    onUpdate?.({ id, dialogue: val });
  };

  const handleActChange = (e) => {
    const val = e.target.value;
    setAct(val);
    onUpdate?.({ id, action: val });
  };

  return (
    <BaseCard
      id={id}
      type="script"
      x={x}
      y={y}
      width={width}
      onUpdate={onUpdate}
      onDelete={onDelete}
      className="draggable font-mono bg-white"
      {...props}
    >
      <div className="flex items-center gap-2 mb-3">
        <FileText className="w-4 h-4 text-purple-600" />
        <span className="text-xs font-medium text-gray-600">Script</span>
      </div>

      {/* Scene Heading */}
      <div className="mb-3">
        <div className="flex items-center gap-2 mb-1">
          <select
            value={scene}
            onChange={handleSceneChange}
            className="text-xs font-bold uppercase bg-transparent border-0 p-0 focus:ring-0"
          >
            {sceneTypes.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
          <Input
            value={loc}
            onChange={handleLocChange}
            placeholder="LOCATION"
            className="text-xs font-bold uppercase border-0 p-0 h-auto bg-transparent focus-visible:ring-0 placeholder:uppercase flex-1"
            style={{ boxShadow: 'none' }}
          />
          {time && (
            <Badge variant="outline" className="text-xs">
              {time}
            </Badge>
          )}
        </div>
        <Input
          value={time}
          onChange={handleTimeChange}
          placeholder="Time of day (DAY/NIGHT)"
          className="text-xs border-gray-200 h-7"
        />
      </div>

      {/* Action */}
      <div className="mb-3">
        <Textarea
          value={act}
          onChange={handleActChange}
          placeholder="Action..."
          className="min-h-[60px] text-xs border-gray-200 resize-none font-sans"
        />
      </div>

      {/* Character & Dialogue */}
      {(char || dial) && (
        <div className="mb-2">
          <div className="flex items-center gap-2 mb-1">
            <User className="w-3 h-3 text-gray-400" />
            <Input
              value={char}
              onChange={handleCharChange}
              placeholder="CHARACTER"
              className="text-sm font-bold border-0 p-0 h-auto bg-transparent focus-visible:ring-0 placeholder:uppercase w-32"
              style={{ boxShadow: 'none' }}
            />
          </div>
          <Textarea
            value={dial}
            onChange={handleDialChange}
            placeholder="Dialogue..."
            className="min-h-[60px] text-sm border-0 p-0 resize-none focus-visible:ring-0 ml-6"
            style={{ boxShadow: 'none' }}
          />
        </div>
      )}
    </BaseCard>
  );
}

