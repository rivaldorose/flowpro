import React, { useState, useRef, useEffect } from 'react';
import { Plus, Layers } from 'lucide-react';
import { Button } from '@/components/ui/button';

/**
 * Canvas Mode - Infinite canvas workspace for project
 * Similar to BlankCanvasTemplate but integrated into project workspace
 */
export default function CanvasMode({ project }) {
  const canvasRef = useRef(null);
  const contentRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });
  const [scrollPos, setScrollPos] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(100);

  useEffect(() => {
    const main = canvasRef.current;
    const content = contentRef.current;
    if (!main || !content) return;

    // Center the view initially
    const centerX = (content.offsetWidth - main.clientWidth) / 2;
    const centerY = (content.offsetHeight - main.clientHeight) / 2;
    main.scrollLeft = centerX;
    main.scrollTop = centerY;
  }, []);

  useEffect(() => {
    const main = canvasRef.current;
    if (!main) return;

    const handleMouseDown = (e) => {
      if (
        e.target.closest('button') ||
        e.target.closest('.card-item') ||
        e.target.closest('.note-item')
      ) {
        return;
      }

      setIsDragging(true);
      main.classList.add('cursor-grabbing');
      main.classList.remove('cursor-grab');
      setStartPos({
        x: e.pageX - main.offsetLeft,
        y: e.pageY - main.offsetTop,
      });
      setScrollPos({
        x: main.scrollLeft,
        y: main.scrollTop,
      });
    };

    const handleMouseLeave = () => {
      setIsDragging(false);
      main.classList.remove('cursor-grabbing');
      main.classList.add('cursor-grab');
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      main.classList.remove('cursor-grabbing');
      main.classList.add('cursor-grab');
    };

    const handleMouseMove = (e) => {
      if (!isDragging) return;
      e.preventDefault();
      const x = e.pageX - main.offsetLeft;
      const y = e.pageY - main.offsetTop;
      const walkX = (x - startPos.x) * 1;
      const walkY = (y - startPos.y) * 1;
      main.scrollLeft = scrollPos.x - walkX;
      main.scrollTop = scrollPos.y - walkY;
    };

    main.addEventListener('mousedown', handleMouseDown);
    main.addEventListener('mouseleave', handleMouseLeave);
    main.addEventListener('mouseup', handleMouseUp);
    main.addEventListener('mousemove', handleMouseMove);

    return () => {
      main.removeEventListener('mousedown', handleMouseDown);
      main.removeEventListener('mouseleave', handleMouseLeave);
      main.removeEventListener('mouseup', handleMouseUp);
      main.removeEventListener('mousemove', handleMouseMove);
    };
  }, [isDragging, startPos, scrollPos]);

  const handleZoomIn = () => {
    setZoom((prev) => Math.min(prev + 10, 200));
  };

  const handleZoomOut = () => {
    setZoom((prev) => Math.max(prev - 10, 50));
  };

  return (
    <div className="relative h-full w-full">
      {/* Canvas Area */}
      <main
        ref={canvasRef}
        className="h-full w-full overflow-auto cursor-grab relative"
        style={{
          backgroundImage: 'radial-gradient(#D6D3D1 1px, transparent 1px)',
          backgroundSize: '24px 24px',
        }}
      >
        {/* Infinite Canvas Container */}
        <div
          ref={contentRef}
          className="relative w-[3000px] h-[2000px] p-20 transform origin-top-left flex items-center justify-center"
          style={{ transform: `scale(${zoom / 100})` }}
        >
          {/* Welcome Message (if canvas is empty) */}
          <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-2xl shadow-lg p-10 max-w-lg w-full text-center border border-gray-200">
            <div className="w-12 h-12 bg-purple-50 rounded-full flex items-center justify-center mx-auto mb-6 text-purple-600">
              <Layers className="w-6 h-6" />
            </div>
            <h2 className="text-2xl font-serif font-medium text-gray-900 mb-3">Project Canvas</h2>
            <p className="text-gray-500 mb-8 leading-relaxed">
              Your visual workspace for <strong>{project?.title}</strong>. Start by adding cards, notes, or images to organize your ideas.
            </p>
            <Button className="w-full bg-purple-600 hover:bg-purple-700">
              <Plus className="w-4 h-4 mr-2" />
              Add First Card
            </Button>
          </div>

          {/* TODO: Canvas items will be added here */}
        </div>
      </main>

      {/* Floating Action Button */}
      <div className="fixed bottom-8 right-8 z-50">
        <Button
          size="lg"
          className="h-14 w-14 rounded-full bg-purple-600 hover:bg-purple-700 shadow-lg hover:shadow-xl transition-all transform hover:scale-105 active:scale-95"
          title="Add Card"
        >
          <Plus className="w-6 h-6" />
        </Button>
      </div>

      {/* Zoom Controls */}
      <div className="fixed bottom-8 left-8 z-40 bg-white rounded-lg shadow-lg border border-gray-200 flex items-center p-1">
        <Button
          variant="ghost"
          size="icon"
          onClick={handleZoomOut}
          className="h-8 w-8"
        >
          <span className="text-gray-600">−</span>
        </Button>
        <span className="px-3 text-xs font-mono text-gray-600 w-14 text-center select-none">
          {zoom}%
        </span>
        <Button
          variant="ghost"
          size="icon"
          onClick={handleZoomIn}
          className="h-8 w-8"
        >
          <span className="text-gray-600">+</span>
        </Button>
      </div>
    </div>
  );
}

