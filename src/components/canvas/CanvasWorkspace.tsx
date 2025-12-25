import React, { useState, useCallback, useRef } from 'react';
import { useCanvas } from '@/hooks/useCanvas';
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts';
import { Plus, FileText, Image as ImageIcon, StickyNote, Square } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import FabricCanvas from './FabricCanvas';
import LayersPanel from './LayersPanel';
import PropertiesPanel from './PropertiesPanel';
import CanvasToolbar from './CanvasToolbar';
import Minimap from './Minimap';
import type { CanvasObject } from '@/types/canvas';

interface CanvasWorkspaceProps {
  projectId: string;
}

/**
 * Canvas Workspace - Main container for Figma-style canvas
 * Combines all panels, canvas, and controls
 */
export default function CanvasWorkspace({ projectId }: CanvasWorkspaceProps) {
  const {
    objects,
    isLoading,
    state,
    addObject,
    updateObject,
    deleteObject,
    selectObject,
    deselectAll,
    selectAll,
    setZoom,
    setPan,
    setTool,
  } = useCanvas(projectId);

  const selectedObjects = objects.filter(obj => 
    (state.selectedObjectIds || []).includes(obj.id)
  );

  // Handle creating new objects with tools
  const handleCreateObject = useCallback((type: CanvasObject['type']) => {
    const viewportWidth = window.innerWidth - 280 - 320;
    const viewportHeight = window.innerHeight - 48 - 48;
    const centerX = (state.panX || 0) + viewportWidth / 2;
    const centerY = (state.panY || 0) + viewportHeight / 2;

    const baseData: Partial<CanvasObject> = {
      type,
      x: centerX - 150,
      y: centerY - 100,
      zIndex: objects.length,
    };

    switch (type) {
      case 'text':
        addObject({
          ...baseData,
          width: 300,
          height: 100,
          data: { content: 'New text', fontSize: 14, fontFamily: 'Inter' },
        });
        break;
      case 'image':
        addObject({
          ...baseData,
          width: 400,
          height: 300,
          data: { placeholder: true },
        });
        break;
      case 'note':
        addObject({
          ...baseData,
          width: 250,
          height: 250,
          data: { 
            content: '', 
            color: ['#FFEB3B', '#FFC107', '#FF9800', '#FF5722', '#E91E63'][Math.floor(Math.random() * 5)]
          },
        });
        break;
      case 'section':
        addObject({
          ...baseData,
          width: 500,
          height: 400,
          data: { label: 'New Section', backgroundColor: '#FAFAFA', borderColor: '#6B46C1' },
        });
        break;
    }
  }, [addObject, objects.length, state.panX, state.panY]);

  // Zoom functions
  const handleZoomIn = useCallback(() => {
    setZoom((state.zoom || 100) * 1.1);
  }, [state.zoom, setZoom]);

  const handleZoomOut = useCallback(() => {
    setZoom((state.zoom || 100) * 0.9);
  }, [state.zoom, setZoom]);

  const handleZoomToFit = useCallback(() => {
    if (objects.length === 0) {
      setZoom(100);
      return;
    }

    // Calculate bounds of all objects
    const bounds = objects.reduce(
      (acc, obj) => ({
        minX: Math.min(acc.minX, obj.x),
        minY: Math.min(acc.minY, obj.y),
        maxX: Math.max(acc.maxX, obj.x + obj.width),
        maxY: Math.max(acc.maxY, obj.y + obj.height),
      }),
      { minX: Infinity, minY: Infinity, maxX: -Infinity, maxY: -Infinity }
    );

    const contentWidth = bounds.maxX - bounds.minX;
    const contentHeight = bounds.maxY - bounds.minY;
    const viewportWidth = window.innerWidth - 280 - 320; // Subtract panel widths
    const viewportHeight = window.innerHeight - 48 - 48; // Subtract header/toolbar

    const zoomX = (viewportWidth * 0.9) / contentWidth;
    const zoomY = (viewportHeight * 0.9) / contentHeight;
    const newZoom = Math.min(zoomX, zoomY) * 100;

    setZoom(Math.max(1, Math.min(6400, newZoom)));
    setPan(bounds.minX - 20, bounds.minY - 20);
  }, [objects, setZoom, setPan]);

  const handleZoomTo100 = useCallback(() => {
    setZoom(100);
  }, [setZoom]);

  const handleZoomToSelection = useCallback(() => {
    if (selectedObjects.length === 0) return;

    const bounds = selectedObjects.reduce(
      (acc, obj) => ({
        minX: Math.min(acc.minX, obj.x),
        minY: Math.min(acc.minY, obj.y),
        maxX: Math.max(acc.maxX, obj.x + obj.width),
        maxY: Math.max(acc.maxY, obj.y + obj.height),
      }),
      { minX: Infinity, minY: Infinity, maxX: -Infinity, maxY: -Infinity }
    );

    const contentWidth = bounds.maxX - bounds.minX;
    const contentHeight = bounds.maxY - bounds.minY;
    const viewportWidth = window.innerWidth - 280 - 320;
    const viewportHeight = window.innerHeight - 48 - 48;

    const zoomX = (viewportWidth * 0.8) / contentWidth;
    const zoomY = (viewportHeight * 0.8) / contentHeight;
    const newZoom = Math.min(zoomX, zoomY) * 100;

    setZoom(Math.max(1, Math.min(6400, newZoom)));
    setPan(bounds.minX - 20, bounds.minY - 20);
  }, [selectedObjects, setZoom, setPan]);

  // Object actions
  const handleDuplicate = useCallback(() => {
    if (selectedObjects.length === 0) return;
    selectedObjects.forEach(obj => {
      addObject({
        ...obj,
        id: undefined,
        x: obj.x + 20,
        y: obj.y + 20,
        zIndex: objects.length,
      });
    });
  }, [selectedObjects, addObject, objects.length]);

  const handleDelete = useCallback(() => {
    if (selectedObjects.length === 0) return;
    selectedObjects.forEach(obj => deleteObject(obj.id));
    deselectAll();
  }, [selectedObjects, deleteObject, deselectAll]);

  const handleToggleVisibility = useCallback((id: string) => {
    const obj = objects.find(o => o.id === id);
    if (obj) {
      updateObject(id, { visible: obj.visible === false });
    }
  }, [objects, updateObject]);

  const handleToggleLock = useCallback((id: string) => {
    const obj = objects.find(o => o.id === id);
    if (obj) {
      updateObject(id, { locked: !obj.locked });
    }
  }, [objects, updateObject]);

  // Keyboard shortcuts
  useKeyboardShortcuts({
    onZoomToFit: handleZoomToFit,
    onZoomTo100: handleZoomTo100,
    onZoomToSelection: handleZoomToSelection,
    onSelectAll: selectAll,
    onDuplicate: handleDuplicate,
    onDelete: handleDelete,
    onToolSelect: () => setTool('select'),
    onToolHand: () => setTool('hand'),
    onToolZoom: () => setTool('zoom'),
    onToolText: () => setTool('text'),
    onToolFrame: () => setTool('frame'),
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-gray-400">Loading canvas...</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-gray-50">
      {/* Toolbar */}
      <CanvasToolbar
        tool={state.tool || 'select'}
        zoom={state.zoom || 100}
        onToolChange={setTool}
        onZoomIn={handleZoomIn}
        onZoomOut={handleZoomOut}
        onZoomToFit={handleZoomToFit}
        onZoomTo100={handleZoomTo100}
      />

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Layers Panel */}
        <LayersPanel
          objects={objects}
          selectedObjectIds={state.selectedObjectIds || []}
          onSelectObject={selectObject}
          onToggleVisibility={handleToggleVisibility}
          onToggleLock={handleToggleLock}
        />

        {/* Canvas Area */}
        <div className="flex-1 relative">
          <FabricCanvas
            objects={objects}
            selectedObjectIds={state.selectedObjectIds || []}
            zoom={state.zoom || 100}
            panX={state.panX || 0}
            panY={state.panY || 0}
            tool={state.tool || 'select'}
            onObjectChange={updateObject}
            onSelectionChange={(ids) => {
              if (ids.length === 0) {
                deselectAll();
              } else {
                ids.forEach(id => selectObject(id, true));
              }
            }}
            onZoomChange={setZoom}
            onPanChange={setPan}
          />

          {/* Floating Action Button for adding objects */}
          <div className="absolute bottom-8 right-8 z-50">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  size="lg"
                  className="h-14 w-14 rounded-full bg-purple-600 hover:bg-purple-700 shadow-lg hover:shadow-xl transition-all transform hover:scale-105 active:scale-95"
                  title="Add Object"
                >
                  <Plus className="w-6 h-6" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" side="top" className="w-48">
                <DropdownMenuItem onClick={() => handleCreateObject('text')}>
                  <FileText className="w-4 h-4 mr-2" />
                  Text Card
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleCreateObject('image')}>
                  <ImageIcon className="w-4 h-4 mr-2" />
                  Image
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleCreateObject('note')}>
                  <StickyNote className="w-4 h-4 mr-2" />
                  Note
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleCreateObject('section')}>
                  <Square className="w-4 h-4 mr-2" />
                  Section
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Minimap */}
          <Minimap
            objects={objects}
            viewportBounds={{
              x: state.panX || 0,
              y: state.panY || 0,
              width: window.innerWidth - 280 - 320,
              height: window.innerHeight - 48 - 48,
            }}
            canvasBounds={{ width: 5000, height: 3000 }}
            zoom={state.zoom || 100}
            onViewportChange={setPan}
          />
        </div>

        {/* Properties Panel */}
        <PropertiesPanel
          selectedObjects={selectedObjects}
          onUpdateObject={updateObject}
          onDeleteObject={deleteObject}
          onDuplicateObject={(id) => {
            const obj = objects.find(o => o.id === id);
            if (obj) {
              addObject({
                ...obj,
                id: undefined,
                x: obj.x + 20,
                y: obj.y + 20,
                zIndex: objects.length,
              });
            }
          }}
          onToggleLock={handleToggleLock}
        />
      </div>
    </div>
  );
}

