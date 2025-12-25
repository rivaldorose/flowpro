import React from 'react';
import { Move, Hand, ZoomIn, Type, Square, Layers } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import type { CanvasState } from '@/types/canvas';

interface CanvasToolbarProps {
  tool: CanvasState['tool'];
  zoom: number;
  onToolChange: (tool: CanvasState['tool']) => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onZoomToFit: () => void;
  onZoomTo100: () => void;
}

/**
 * Canvas Toolbar - Top toolbar with tools and zoom controls
 * Figma-style toolbar
 */
export default function CanvasToolbar({
  tool,
  zoom,
  onToolChange,
  onZoomIn,
  onZoomOut,
  onZoomToFit,
  onZoomTo100,
}: CanvasToolbarProps) {
  const tools = [
    { id: 'select' as const, icon: Move, label: 'Select (V)' },
    { id: 'hand' as const, icon: Hand, label: 'Hand (H)' },
    { id: 'zoom' as const, icon: ZoomIn, label: 'Zoom (Z)' },
    { id: 'text' as const, icon: Type, label: 'Text (T)' },
    { id: 'frame' as const, icon: Square, label: 'Frame (F)' },
  ];

  return (
    <div className="h-12 bg-white border-b border-gray-200 flex items-center justify-between px-4">
      {/* Left: Tools */}
      <div className="flex items-center gap-1">
        {tools.map(({ id, icon: Icon, label }) => (
          <Button
            key={id}
            variant="ghost"
            size="sm"
            onClick={() => onToolChange(id)}
            className={cn(
              "h-8 w-8 p-0",
              tool === id && "bg-purple-50 text-purple-700"
            )}
            title={label}
          >
            <Icon className="w-4 h-4" />
          </Button>
        ))}
      </div>

      {/* Right: Zoom Controls */}
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={onZoomOut}
          className="h-8 w-8 p-0"
          title="Zoom Out"
        >
          <span className="text-sm">−</span>
        </Button>
        <div className="flex items-center gap-2 px-3">
          <span className="text-xs font-mono text-gray-600 w-12 text-center">
            {Math.round(zoom)}%
          </span>
          <Button
            variant="ghost"
            size="sm"
            onClick={onZoomTo100}
            className="h-6 px-2 text-xs"
          >
            100%
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={onZoomToFit}
            className="h-6 px-2 text-xs"
          >
            Fit
          </Button>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={onZoomIn}
          className="h-8 w-8 p-0"
          title="Zoom In"
        >
          <span className="text-sm">+</span>
        </Button>
      </div>
    </div>
  );
}

