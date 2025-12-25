import React, { useState } from 'react';
import { ChevronRight, ChevronDown, Eye, EyeOff, Lock, Unlock, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import type { CanvasObject } from '@/types/canvas';

interface LayersPanelProps {
  objects: CanvasObject[];
  selectedObjectIds: string[];
  onSelectObject: (id: string, addToSelection?: boolean) => void;
  onToggleVisibility: (id: string) => void;
  onToggleLock: (id: string) => void;
}

/**
 * Layers Panel - Left sidebar showing object hierarchy
 * Figma-style layers panel
 */
export default function LayersPanel({
  objects,
  selectedObjectIds,
  onSelectObject,
  onToggleVisibility,
  onToggleLock,
}: LayersPanelProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set());

  // Group objects by parent (for hierarchy)
  const rootObjects = objects.filter(obj => !obj.parentId);
  const groupedObjects = objects.reduce((acc, obj) => {
    if (obj.parentId) {
      if (!acc[obj.parentId]) acc[obj.parentId] = [];
      acc[obj.parentId].push(obj);
    }
    return acc;
  }, {} as Record<string, CanvasObject[]>);

  const filteredObjects = searchQuery
    ? objects.filter(obj => {
        const label = obj.data?.label || obj.data?.heading || obj.type;
        return label.toLowerCase().includes(searchQuery.toLowerCase());
      })
    : rootObjects;

  const toggleSection = (id: string) => {
    setExpandedSections(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const getObjectIcon = (type: CanvasObject['type']) => {
    switch (type) {
      case 'section':
        return '📦';
      case 'script':
        return '📝';
      case 'shot':
        return '📸';
      case 'note':
        return '📌';
      case 'text':
        return '📄';
      case 'image':
        return '🖼️';
      case 'group':
        return '🔗';
      default:
        return '📦';
    }
  };

  const getObjectLabel = (obj: CanvasObject) => {
    if (obj.data?.label) return obj.data.label;
    if (obj.data?.heading) return obj.data.heading;
    if (obj.type === 'shot' && obj.data?.shotNumber) {
      return `Shot ${obj.data.shotNumber}`;
    }
    return `${obj.type.charAt(0).toUpperCase() + obj.type.slice(1)} ${obj.id.slice(0, 4)}`;
  };

  const renderLayerItem = (obj: CanvasObject, depth = 0) => {
    const isSelected = selectedObjectIds.includes(obj.id);
    const isExpanded = expandedSections.has(obj.id);
    const hasChildren = groupedObjects[obj.id]?.length > 0;
    const children = groupedObjects[obj.id] || [];

    return (
      <div key={obj.id}>
        <div
          className={`
            flex items-center gap-2 px-2 py-1.5 rounded-md cursor-pointer
            hover:bg-gray-100 transition-colors
            ${isSelected ? 'bg-blue-50 text-blue-700' : 'text-gray-700'}
          `}
          style={{ paddingLeft: `${8 + depth * 20}px` }}
          onClick={(e) => {
            e.stopPropagation();
            onSelectObject(obj.id, e.shiftKey);
          }}
        >
          {/* Expand/Collapse */}
          {hasChildren ? (
            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleSection(obj.id);
              }}
              className="p-0.5 hover:bg-gray-200 rounded"
            >
              {isExpanded ? (
                <ChevronDown className="w-3 h-3" />
              ) : (
                <ChevronRight className="w-3 h-3" />
              )}
            </button>
          ) : (
            <div className="w-4" />
          )}

          {/* Icon */}
          <span className="text-sm">{getObjectIcon(obj.type)}</span>

          {/* Label */}
          <span className="flex-1 text-sm font-medium truncate">
            {getObjectLabel(obj)}
          </span>

          {/* Actions */}
          <div className="flex items-center gap-1">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onToggleVisibility(obj.id);
              }}
              className="p-1 hover:bg-gray-200 rounded opacity-0 group-hover:opacity-100 transition-opacity"
            >
              {obj.visible !== false ? (
                <Eye className="w-3 h-3" />
              ) : (
                <EyeOff className="w-3 h-3 text-gray-400" />
              )}
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onToggleLock(obj.id);
              }}
              className="p-1 hover:bg-gray-200 rounded opacity-0 group-hover:opacity-100 transition-opacity"
            >
              {obj.locked ? (
                <Lock className="w-3 h-3" />
              ) : (
                <Unlock className="w-3 h-3 text-gray-400" />
              )}
            </button>
          </div>
        </div>

        {/* Children */}
        {hasChildren && isExpanded && (
          <div>
            {children.map(child => renderLayerItem(child, depth + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="w-72 bg-white border-r border-gray-200 flex flex-col h-full">
      {/* Header */}
      <div className="p-3 border-b border-gray-200">
        <h2 className="text-sm font-semibold text-gray-900 mb-2">Layers</h2>
        <div className="relative">
          <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            placeholder="Search layers..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8 h-8 text-sm"
          />
        </div>
      </div>

      {/* Layers List */}
      <ScrollArea className="flex-1">
        <div className="p-2 space-y-0.5">
          {filteredObjects.length === 0 ? (
            <div className="text-center py-8 text-gray-400 text-sm">
              {searchQuery ? 'No layers found' : 'No layers yet'}
            </div>
          ) : (
            filteredObjects.map(obj => renderLayerItem(obj))
          )}
        </div>
      </ScrollArea>
    </div>
  );
}

