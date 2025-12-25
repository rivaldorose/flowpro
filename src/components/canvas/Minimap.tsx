import React, { useRef, useEffect } from 'react';
import type { CanvasObject } from '@/types/canvas';

interface MinimapProps {
  objects: CanvasObject[];
  viewportBounds: { x: number; y: number; width: number; height: number };
  canvasBounds: { width: number; height: number };
  zoom: number;
  onViewportChange: (x: number, y: number) => void;
}

/**
 * Minimap - Bottom-right overview of canvas
 * Shows all objects and current viewport
 */
export default function Minimap({
  objects,
  viewportBounds,
  canvasBounds,
  zoom,
  onViewportChange,
}: MinimapProps) {
  const minimapRef = useRef<HTMLCanvasElement>(null);
  const isDraggingRef = useRef(false);

  // Calculate scale to fit all objects in minimap
  const allObjectsBounds = objects.reduce(
    (bounds, obj) => ({
      minX: Math.min(bounds.minX, obj.x),
      minY: Math.min(bounds.minY, obj.y),
      maxX: Math.max(bounds.maxX, obj.x + obj.width),
      maxY: Math.max(bounds.maxY, obj.y + obj.height),
    }),
    { minX: 0, minY: 0, maxX: 2000, maxY: 2000 }
  );

  const contentWidth = allObjectsBounds.maxX - allObjectsBounds.minX;
  const contentHeight = allObjectsBounds.maxY - allObjectsBounds.minY;
  const scaleX = 150 / Math.max(contentWidth, 1000);
  const scaleY = 100 / Math.max(contentHeight, 1000);
  const scale = Math.min(scaleX, scaleY);

  useEffect(() => {
    const canvas = minimapRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear
    ctx.clearRect(0, 0, 150, 100);
    ctx.fillStyle = '#F5F5F5';
    ctx.fillRect(0, 0, 150, 100);

    // Draw grid
    ctx.strokeStyle = '#E5E5E5';
    ctx.lineWidth = 0.5;
    for (let x = 0; x < 150; x += 10) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, 100);
      ctx.stroke();
    }
    for (let y = 0; y < 100; y += 10) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(150, y);
      ctx.stroke();
    }

    // Draw objects
    ctx.fillStyle = '#6B46C1';
    ctx.strokeStyle = '#6B46C1';
    objects.forEach(obj => {
      if (obj.visible === false) return;

      const x = (obj.x - allObjectsBounds.minX) * scale;
      const y = (obj.y - allObjectsBounds.minY) * scale;
      const w = obj.width * scale;
      const h = obj.height * scale;

      ctx.fillRect(x, y, w, h);
    });

    // Draw viewport rectangle
    const viewportX = (viewportBounds.x - allObjectsBounds.minX) * scale;
    const viewportY = (viewportBounds.y - allObjectsBounds.minY) * scale;
    const viewportW = (viewportBounds.width / zoom) * scale;
    const viewportH = (viewportBounds.height / zoom) * scale;

    ctx.strokeStyle = '#3B82F6';
    ctx.lineWidth = 2;
    ctx.strokeRect(viewportX, viewportY, viewportW, viewportH);
  }, [objects, viewportBounds, zoom, scale, allObjectsBounds]);

  const handleMouseDown = (e: React.MouseEvent) => {
    isDraggingRef.current = true;
    const rect = minimapRef.current?.getBoundingClientRect();
    if (!rect) return;

    const x = (e.clientX - rect.left) / scale + allObjectsBounds.minX;
    const y = (e.clientY - rect.top) / scale + allObjectsBounds.minY;
    onViewportChange(x, y);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDraggingRef.current) return;
    const rect = minimapRef.current?.getBoundingClientRect();
    if (!rect) return;

    const x = (e.clientX - rect.left) / scale + allObjectsBounds.minX;
    const y = (e.clientY - rect.top) / scale + allObjectsBounds.minY;
    onViewportChange(x, y);
  };

  const handleMouseUp = () => {
    isDraggingRef.current = false;
  };

  return (
    <div className="absolute bottom-4 right-4 bg-white border border-gray-300 rounded-lg shadow-lg p-2 z-50">
      <canvas
        ref={minimapRef}
        width={150}
        height={100}
        className="cursor-pointer"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      />
    </div>
  );
}

