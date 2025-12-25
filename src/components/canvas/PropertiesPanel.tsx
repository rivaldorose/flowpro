import React from 'react';
import { Trash2, Copy, Lock, Unlock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import type { CanvasObject } from '@/types/canvas';

interface PropertiesPanelProps {
  selectedObjects: CanvasObject[];
  onUpdateObject: (id: string, updates: Partial<CanvasObject>) => void;
  onDeleteObject: (id: string) => void;
  onDuplicateObject: (id: string) => void;
  onToggleLock: (id: string) => void;
}

/**
 * Properties Panel - Right sidebar showing object properties
 * Figma-style properties panel
 */
export default function PropertiesPanel({
  selectedObjects,
  onUpdateObject,
  onDeleteObject,
  onDuplicateObject,
  onToggleLock,
}: PropertiesPanelProps) {
  if (selectedObjects.length === 0) {
    return (
      <div className="w-80 bg-white border-l border-gray-200 flex flex-col h-full">
        <div className="p-4">
          <h2 className="text-sm font-semibold text-gray-900 mb-2">Properties</h2>
          <p className="text-sm text-gray-500">Select an object to view properties</p>
        </div>
      </div>
    );
  }

  const obj = selectedObjects[0]; // Show properties for first selected object

  const handlePositionChange = (field: 'x' | 'y', value: string) => {
    const numValue = parseFloat(value) || 0;
    onUpdateObject(obj.id, { [field]: numValue });
  };

  const handleSizeChange = (field: 'width' | 'height', value: string) => {
    const numValue = parseFloat(value) || 0;
    onUpdateObject(obj.id, { [field]: Math.max(50, numValue) });
  };

  const handleOpacityChange = (value: string) => {
    const numValue = parseFloat(value) || 100;
    onUpdateObject(obj.id, { opacity: Math.max(0, Math.min(100, numValue)) / 100 });
  };

  return (
    <div className="w-80 bg-white border-l border-gray-200 flex flex-col h-full overflow-y-auto">
      <div className="p-4 space-y-6">
        {/* Header */}
        <div>
          <h2 className="text-sm font-semibold text-gray-900 mb-1">Properties</h2>
          {selectedObjects.length > 1 && (
            <p className="text-xs text-gray-500">{selectedObjects.length} objects selected</p>
          )}
        </div>

        <Separator />

        {/* Position */}
        <div className="space-y-2">
          <Label className="text-xs font-semibold text-gray-700 uppercase">Position</Label>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <Label className="text-xs text-gray-500">X</Label>
              <Input
                type="number"
                value={Math.round(obj.x)}
                onChange={(e) => handlePositionChange('x', e.target.value)}
                className="h-8 text-sm"
              />
            </div>
            <div>
              <Label className="text-xs text-gray-500">Y</Label>
              <Input
                type="number"
                value={Math.round(obj.y)}
                onChange={(e) => handlePositionChange('y', e.target.value)}
                className="h-8 text-sm"
              />
            </div>
          </div>
        </div>

        {/* Size */}
        <div className="space-y-2">
          <Label className="text-xs font-semibold text-gray-700 uppercase">Size</Label>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <Label className="text-xs text-gray-500">W</Label>
              <Input
                type="number"
                value={Math.round(obj.width)}
                onChange={(e) => handleSizeChange('width', e.target.value)}
                className="h-8 text-sm"
                min={50}
              />
            </div>
            <div>
              <Label className="text-xs text-gray-500">H</Label>
              <Input
                type="number"
                value={Math.round(obj.height)}
                onChange={(e) => handleSizeChange('height', e.target.value)}
                className="h-8 text-sm"
                min={50}
              />
            </div>
          </div>
        </div>

        {/* Opacity */}
        <div className="space-y-2">
          <Label className="text-xs font-semibold text-gray-700 uppercase">Opacity</Label>
          <div className="flex items-center gap-2">
            <Input
              type="number"
              value={Math.round((obj.opacity || 1) * 100)}
              onChange={(e) => handleOpacityChange(e.target.value)}
              className="h-8 text-sm flex-1"
              min={0}
              max={100}
            />
            <span className="text-xs text-gray-500">%</span>
          </div>
        </div>

        {/* Type-specific properties */}
        {obj.type === 'section' && (
          <div className="space-y-2">
            <Label className="text-xs font-semibold text-gray-700 uppercase">Section</Label>
            <Input
              value={obj.data?.label || ''}
              onChange={(e) => onUpdateObject(obj.id, {
                data: { ...obj.data, label: e.target.value }
              })}
              placeholder="Section name..."
              className="h-8 text-sm"
            />
          </div>
        )}

        {obj.type === 'text' && (
          <div className="space-y-2">
            <Label className="text-xs font-semibold text-gray-700 uppercase">Text</Label>
            <textarea
              value={obj.data?.content || ''}
              onChange={(e) => onUpdateObject(obj.id, {
                data: { ...obj.data, content: e.target.value }
              })}
              placeholder="Enter text..."
              className="w-full min-h-[100px] p-2 text-sm border border-gray-300 rounded-md resize-none"
            />
          </div>
        )}

        {obj.type === 'note' && (
          <div className="space-y-2">
            <Label className="text-xs font-semibold text-gray-700 uppercase">Note</Label>
            <textarea
              value={obj.data?.content || ''}
              onChange={(e) => onUpdateObject(obj.id, {
                data: { ...obj.data, content: e.target.value }
              })}
              placeholder="Write a note..."
              className="w-full min-h-[100px] p-2 text-sm border border-gray-300 rounded-md resize-none"
            />
          </div>
        )}

        <Separator />

        {/* Actions */}
        <div className="space-y-2">
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onDuplicateObject(obj.id)}
              className="flex-1"
            >
              <Copy className="w-4 h-4 mr-2" />
              Duplicate
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onToggleLock(obj.id)}
            >
              {obj.locked ? (
                <Unlock className="w-4 h-4" />
              ) : (
                <Lock className="w-4 h-4" />
              )}
            </Button>
          </div>
          <Button
            variant="destructive"
            size="sm"
            onClick={() => onDeleteObject(obj.id)}
            className="w-full"
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Delete
          </Button>
        </div>
      </div>
    </div>
  );
}

