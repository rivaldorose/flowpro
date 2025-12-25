import * as fabric from 'fabric';
import type { CanvasObject } from '@/types/canvas';

/**
 * Fabric.js Utilities
 * Helpers for converting between CanvasObject and Fabric objects
 */

export function createFabricObject(obj: CanvasObject): fabric.Object {
  let fabricObj: fabric.Object;

  switch (obj.type) {
    case 'section':
      fabricObj = new fabric.Rect({
        left: obj.x,
        top: obj.y,
        width: obj.width,
        height: obj.height,
        fill: obj.data.backgroundColor || '#FAFAFA',
        stroke: obj.data.borderColor || '#6B46C1',
        strokeWidth: 2,
        rx: 8,
        ry: 8,
      });
      break;

    case 'text':
      fabricObj = new fabric.Textbox(obj.data.content || '', {
        left: obj.x,
        top: obj.y,
        width: obj.width,
        fontSize: obj.data.fontSize || 14,
        fontFamily: obj.data.fontFamily || 'Inter',
        textAlign: obj.data.textAlign || 'left',
        fill: '#1F2937',
      });
      break;

    case 'note':
      // Create group with background and text
      const noteBg = new fabric.Rect({
        left: 0,
        top: 0,
        width: obj.width,
        height: obj.height,
        fill: obj.data.color || '#FFEB3B',
        stroke: '#FDD835',
        strokeWidth: 2,
        rx: 4,
        ry: 4,
      });
      const noteText = new fabric.Text(obj.data.content || '', {
        left: 10,
        top: 10,
        fontSize: 12,
        fill: '#000',
        width: obj.width - 20,
      });
      fabricObj = new fabric.Group([noteBg, noteText], {
        left: obj.x,
        top: obj.y,
      });
      break;

    case 'image':
      // Placeholder for now (async loading handled separately)
      fabricObj = new fabric.Rect({
        left: obj.x,
        top: obj.y,
        width: obj.width,
        height: obj.height,
        fill: obj.data.src ? '#E5E7EB' : '#F3F4F6',
        stroke: '#D1D5DB',
        strokeWidth: 1,
        strokeDashArray: obj.data.src ? undefined : [5, 5],
      });
      break;

    default:
      // Default rectangle
      fabricObj = new fabric.Rect({
        left: obj.x,
        top: obj.y,
        width: obj.width,
        height: obj.height,
        fill: 'white',
        stroke: '#6B46C1',
        strokeWidth: 1,
      });
  }

  // Common properties
  fabricObj.set({
    name: obj.id,
    selectable: !obj.locked,
    evented: !obj.locked,
    opacity: obj.opacity || 1,
    visible: obj.visible !== false,
  });

  return fabricObj;
}

/**
 * Load image asynchronously and update fabric object
 */
export async function loadImageIntoFabricObject(
  fabricObj: fabric.Object,
  imageUrl: string,
  targetWidth: number,
  targetHeight: number
): Promise<void> {
  return new Promise((resolve, reject) => {
    fabric.Image.fromURL(imageUrl, (img) => {
      const scaleX = targetWidth / (img.width || 1);
      const scaleY = targetHeight / (img.height || 1);
      
      img.set({
        left: fabricObj.left,
        top: fabricObj.top,
        scaleX,
        scaleY,
        name: fabricObj.name,
        selectable: fabricObj.selectable,
        evented: fabricObj.evented,
        opacity: fabricObj.opacity,
        visible: fabricObj.visible,
      });

      // Replace the placeholder with the image
      const canvas = fabricObj.canvas;
      if (canvas) {
        canvas.remove(fabricObj);
        canvas.add(img);
        canvas.renderAll();
      }

      resolve();
    }, { crossOrigin: 'anonymous' });
  });
}

export function fabricObjectToCanvasObject(
  fabricObj: fabric.Object,
  type: CanvasObject['type'],
  data: Record<string, any> = {}
): Partial<CanvasObject> {
  return {
    id: fabricObj.name || '',
    type,
    x: fabricObj.left || 0,
    y: fabricObj.top || 0,
    width: (fabricObj.width || 0) * (fabricObj.scaleX || 1),
    height: (fabricObj.height || 0) * (fabricObj.scaleY || 1),
    rotation: fabricObj.angle || 0,
    opacity: fabricObj.opacity || 1,
    visible: fabricObj.visible !== false,
    data,
  };
}

/**
 * Configure Fabric canvas with Figma-like settings
 */
export function configureFabricCanvas(canvas: fabric.Canvas) {
  // Enable selection
  canvas.selection = true;
  canvas.selectionColor = 'rgba(59, 130, 246, 0.1)';
  canvas.selectionBorderColor = '#3B82F6';
  canvas.selectionLineWidth = 2;

  // Enable object controls
  canvas.defaultCursor = 'default';
  canvas.hoverCursor = 'move';
  canvas.moveCursor = 'move';

  // Grid pattern background
  canvas.backgroundColor = '#F5F5F5';

  // Performance optimizations
  canvas.renderOnAddRemove = true;
  canvas.stateful = true;

  return canvas;
}

