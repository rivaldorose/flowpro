/**
 * Canvas Types - TypeScript definitions for Figma-style canvas
 */

export type CanvasObjectType = 'section' | 'script' | 'shot' | 'note' | 'text' | 'image' | 'group';

export interface CanvasObject {
  id: string;
  type: CanvasObjectType;
  x: number;
  y: number;
  width: number;
  height: number;
  rotation?: number;
  opacity?: number;
  visible?: boolean;
  locked?: boolean;
  zIndex: number;
  parentId?: string; // For grouping/nesting
  data: Record<string, any>; // Type-specific data
  createdAt: string;
  updatedAt: string;
  createdBy: string;
}

export interface SectionFrame extends CanvasObject {
  type: 'section';
  data: {
    label: string;
    backgroundColor?: string;
    borderColor?: string;
    children?: string[]; // IDs of nested objects
  };
}

export interface ScriptCard extends CanvasObject {
  type: 'script';
  data: {
    sceneNumber: number;
    heading: string;
    content: string;
    comments?: Array<{ id: string; text: string; author: string }>;
  };
}

export interface ShotCard extends CanvasObject {
  type: 'shot';
  data: {
    sceneId: string;
    shotNumber: number;
    shotType: string;
    imageUrl?: string;
    camera?: string;
    lens?: string;
    duration?: string;
  };
}

export interface NoteCard extends CanvasObject {
  type: 'note';
  data: {
    content: string;
    color: string; // Hex color for sticky note
  };
}

export interface TextCard extends CanvasObject {
  type: 'text';
  data: {
    content: string;
    fontSize?: number;
    fontFamily?: string;
    textAlign?: 'left' | 'center' | 'right';
  };
}

export interface ImageCard extends CanvasObject {
  type: 'image';
  data: {
    src: string;
    alt?: string;
    placeholder?: boolean;
  };
}

export interface CanvasState {
  objects: CanvasObject[];
  selectedObjectIds: string[];
  zoom: number;
  panX: number;
  panY: number;
  tool: 'select' | 'hand' | 'zoom' | 'text' | 'frame';
  gridVisible: boolean;
  snapToGrid: boolean;
  gridSize: number;
}

export interface CollaborationCursor {
  userId: string;
  userName: string;
  color: string;
  x: number;
  y: number;
  timestamp: number;
}

