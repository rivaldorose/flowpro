import React from 'react';
import CanvasWorkspace from '@/components/canvas/CanvasWorkspace';

/**
 * Canvas Mode - Figma-style infinite canvas workspace
 * Wrapper for the new CanvasWorkspace component
 */
export default function CanvasMode({ project }) {
  if (!project?.id) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-gray-400">No project selected</div>
      </div>
    );
  }

  return <CanvasWorkspace projectId={project.id} />;
}
