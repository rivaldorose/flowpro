import React, { useEffect, useRef, useCallback } from 'react';
import * as fabric from 'fabric';
import { configureFabricCanvas, createFabricObject, fabricObjectToCanvasObject } from '@/lib/fabricUtils';
import type { CanvasObject } from '@/types/canvas';

interface FabricCanvasProps {
  objects: CanvasObject[];
  selectedObjectIds: string[];
  zoom: number;
  panX: number;
  panY: number;
  tool: 'select' | 'hand' | 'zoom' | 'text' | 'frame';
  onObjectChange: (id: string, updates: Partial<CanvasObject>) => void;
  onSelectionChange: (ids: string[]) => void;
  onZoomChange: (zoom: number) => void;
  onPanChange: (x: number, y: number) => void;
}

/**
 * Fabric.js Canvas Wrapper
 * Handles all canvas rendering and interactions
 */
export default function FabricCanvas({
  objects,
  selectedObjectIds,
  zoom,
  panX,
  panY,
  tool,
  onObjectChange,
  onSelectionChange,
  onZoomChange,
  onPanChange,
}: FabricCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fabricCanvasRef = useRef<fabric.Canvas | null>(null);
  const isPanningRef = useRef(false);
  const lastPanPointRef = useRef({ x: 0, y: 0 });
  const spacePressedRef = useRef(false);

  // Initialize Fabric canvas
  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = new fabric.Canvas(canvasRef.current, {
      width: window.innerWidth,
      height: window.innerHeight,
      backgroundColor: '#F5F5F5',
    });

    configureFabricCanvas(canvas);
    fabricCanvasRef.current = canvas;

    // Cleanup
    return () => {
      canvas.dispose();
    };
  }, []);

  // Update canvas viewport (zoom + pan)
  useEffect(() => {
    if (!fabricCanvasRef.current) return;

    const canvas = fabricCanvasRef.current;
    const vpt = canvas.viewportTransform;
    if (!vpt) return;

    // Set zoom
    const zoomRatio = zoom / 100;
    vpt[0] = zoomRatio; // scaleX
    vpt[3] = zoomRatio; // scaleY

    // Set pan
    vpt[4] = panX;
    vpt[5] = panY;

    canvas.setViewportTransform(vpt);
    canvas.renderAll();
  }, [zoom, panX, panY]);

  // Load objects into canvas
  useEffect(() => {
    if (!fabricCanvasRef.current) return;

    const canvas = fabricCanvasRef.current;
    const existingObjects = canvas.getObjects();
    const existingIds = new Set(existingObjects.map(obj => obj.name).filter(Boolean));

    // Remove objects that no longer exist
    existingObjects.forEach(obj => {
      if (obj.name && !objects.find(o => o.id === obj.name)) {
        canvas.remove(obj);
      }
    });

    // Add/update objects
    objects.forEach(obj => {
      const existing = canvas.getObjects().find(fObj => fObj.name === obj.id);
      
      if (!existing) {
        // Create new object
        const fabricObj = createFabricObject(obj);
        canvas.add(fabricObj);
        
        // Load image if it's an image type
        if (obj.type === 'image' && obj.data?.src) {
          import('@/lib/fabricUtils').then(({ loadImageIntoFabricObject }) => {
            loadImageIntoFabricObject(fabricObj, obj.data.src, obj.width, obj.height).catch(console.error);
          });
        }
      } else {
        // Update existing object
        existing.set({
          left: obj.x,
          top: obj.y,
          width: obj.width,
          height: obj.height,
          opacity: obj.opacity || 1,
          visible: obj.visible !== false,
        });
        canvas.renderAll();
      }
    });
  }, [objects]);

  // Handle selection
  useEffect(() => {
    if (!fabricCanvasRef.current) return;

    const canvas = fabricCanvasRef.current;
    const selectedObjects = canvas.getActiveObjects();
    const selectedIds = selectedObjects.map(obj => obj.name).filter(Boolean);

    if (JSON.stringify(selectedIds) !== JSON.stringify(selectedObjectIds)) {
      // Update canvas selection
      const objectsToSelect = canvas.getObjects().filter(obj => 
        selectedObjectIds.includes(obj.name || '')
      );
      canvas.setActiveObjects(objectsToSelect);
      canvas.renderAll();
    }
  }, [selectedObjectIds]);

  // Object modification handlers
  useEffect(() => {
    if (!fabricCanvasRef.current) return;

    const canvas = fabricCanvasRef.current;

    const handleObjectModified = (e: fabric.IEvent) => {
      const obj = e.target;
      if (!obj || !obj.name) return;

      const canvasObj = objects.find(o => o.id === obj.name);
      if (!canvasObj) return;

      const updates = fabricObjectToCanvasObject(obj, canvasObj.type, canvasObj.data);
      onObjectChange(obj.name, updates);
    };

    const handleSelectionCreated = (e: fabric.IEvent) => {
      const selected = canvas.getActiveObjects();
      const ids = selected.map(obj => obj.name).filter(Boolean);
      onSelectionChange(ids);
    };

    const handleSelectionUpdated = (e: fabric.IEvent) => {
      const selected = canvas.getActiveObjects();
      const ids = selected.map(obj => obj.name).filter(Boolean);
      onSelectionChange(ids);
    };

    const handleSelectionCleared = () => {
      onSelectionChange([]);
    };

    canvas.on('object:modified', handleObjectModified);
    canvas.on('selection:created', handleSelectionCreated);
    canvas.on('selection:updated', handleSelectionUpdated);
    canvas.on('selection:cleared', handleSelectionCleared);

    return () => {
      canvas.off('object:modified', handleObjectModified);
      canvas.off('selection:created', handleSelectionCreated);
      canvas.off('selection:updated', handleSelectionUpdated);
      canvas.off('selection:cleared', handleSelectionCleared);
    };
  }, [objects, onObjectChange, onSelectionChange]);

  // Pan with Space + Drag
  useEffect(() => {
    if (!fabricCanvasRef.current) return;

    const canvas = fabricCanvasRef.current;

    const handleMouseDown = (e: fabric.IEvent) => {
      if (tool === 'hand' || (spacePressedRef.current && tool === 'select')) {
        isPanningRef.current = true;
        lastPanPointRef.current = canvas.getPointer(e.e);
        canvas.defaultCursor = 'grabbing';
      }
    };

    const handleMouseMove = (e: fabric.IEvent) => {
      if (isPanningRef.current) {
        const pointer = canvas.getPointer(e.e);
        const deltaX = pointer.x - lastPanPointRef.current.x;
        const deltaY = pointer.y - lastPanPointRef.current.y;

        const vpt = canvas.viewportTransform;
        if (vpt) {
          vpt[4] += deltaX;
          vpt[5] += deltaY;
          canvas.setViewportTransform(vpt);
          onPanChange(vpt[4], vpt[5]);
        }

        lastPanPointRef.current = pointer;
      }
    };

    const handleMouseUp = () => {
      isPanningRef.current = false;
      canvas.defaultCursor = tool === 'hand' ? 'grab' : 'default';
    };

    // Zoom with scroll wheel
    const handleMouseWheel = (opt: fabric.IEvent) => {
      const delta = opt.e.deltaY;
      const zoomRatio = delta > 0 ? 0.9 : 1.1;
      const newZoom = Math.max(1, Math.min(6400, zoom * zoomRatio));
      onZoomChange(newZoom);
      opt.e.preventDefault();
    };

    canvas.on('mouse:down', handleMouseDown);
    canvas.on('mouse:move', handleMouseMove);
    canvas.on('mouse:up', handleMouseUp);
    canvas.on('mouse:wheel', handleMouseWheel);

    return () => {
      canvas.off('mouse:down', handleMouseDown);
      canvas.off('mouse:move', handleMouseMove);
      canvas.off('mouse:up', handleMouseUp);
      canvas.off('mouse:wheel', handleMouseWheel);
    };
  }, [tool, zoom, onZoomChange, onPanChange]);

  // Keyboard handlers
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        spacePressedRef.current = true;
        if (fabricCanvasRef.current) {
          fabricCanvasRef.current.defaultCursor = 'grab';
        }
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        spacePressedRef.current = false;
        if (fabricCanvasRef.current) {
          fabricCanvasRef.current.defaultCursor = tool === 'hand' ? 'grab' : 'default';
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [tool]);

  return (
    <div className="relative w-full h-full overflow-hidden">
      <canvas ref={canvasRef} className="absolute inset-0" />
    </div>
  );
}

