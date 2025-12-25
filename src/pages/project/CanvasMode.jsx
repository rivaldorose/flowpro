import React, { useState, useRef, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Layers, FileText, Image as ImageIcon, StickyNote, Type, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CanvasItem } from '@/api/entities';
import { supabase } from '@/lib/supabase';
import TextCard from '@/components/canvas/TextCard';
import ImageCard from '@/components/canvas/ImageCard';
import NoteCard from '@/components/canvas/NoteCard';
import SectionCard from '@/components/canvas/SectionCard';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

/**
 * Canvas Mode - Interactive infinite canvas workspace
 * Full Figma-like functionality: drag, resize, edit, delete, upload images
 */
export default function CanvasMode({ project }) {
  const canvasRef = useRef(null);
  const contentRef = useRef(null);
  const queryClient = useQueryClient();
  const [isDraggingCanvas, setIsDraggingCanvas] = useState(false);
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });
  const [scrollPos, setScrollPos] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(100);
  const [showToolbar, setShowToolbar] = useState(false);
  const [draggedItem, setDraggedItem] = useState(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  // Load canvas items from database
  const { data: canvasItems = [], isLoading } = useQuery({
    queryKey: ['canvasItems', project?.id],
    queryFn: async () => {
      if (!project?.id) return [];
      const { data, error } = await supabase
        .from('canvas_items')
        .select('*')
        .eq('project_id', project.id)
        .order('z_index', { ascending: true });
      if (error) throw error;
      return data || [];
    },
    enabled: !!project?.id,
  });

  // Create new canvas item
  const createMutation = useMutation({
    mutationFn: async (itemData) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('canvas_items')
        .insert({
          ...itemData,
          project_id: project.id,
          created_by: user.id,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['canvasItems', project?.id] });
    },
  });

  // Update canvas item
  const updateMutation = useMutation({
    mutationFn: async ({ id, ...updates }) => {
      const { data, error } = await supabase
        .from('canvas_items')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['canvasItems', project?.id] });
    },
  });

  // Delete canvas item
  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      const { error } = await supabase
        .from('canvas_items')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['canvasItems', project?.id] });
    },
  });

  // Center view on mount
  useEffect(() => {
    const main = canvasRef.current;
    const content = contentRef.current;
    if (!main || !content) return;

    const centerX = (content.offsetWidth - main.clientWidth) / 2;
    const centerY = (content.offsetHeight - main.clientHeight) / 2;
    main.scrollLeft = centerX;
    main.scrollTop = centerY;
  }, []);

  // Canvas drag (pan) functionality
  useEffect(() => {
    const main = canvasRef.current;
    if (!main) return;

    const handleMouseDown = (e) => {
      // Don't pan if clicking on a card or button
      if (
        e.target.closest('.card-item') ||
        e.target.closest('button') ||
        e.target.closest('input') ||
        e.target.closest('textarea') ||
        e.target.closest('.toolbar')
      ) {
        return;
      }

      setIsDraggingCanvas(true);
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
      setIsDraggingCanvas(false);
      main.classList.remove('cursor-grabbing');
      main.classList.add('cursor-grab');
    };

    const handleMouseUp = () => {
      setIsDraggingCanvas(false);
      main.classList.remove('cursor-grabbing');
      main.classList.add('cursor-grab');
    };

    const handleMouseMove = (e) => {
      if (!isDraggingCanvas) return;
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
  }, [isDraggingCanvas, startPos, scrollPos]);

  // Handle creating new items
  const handleCreateItem = (type) => {
    const main = canvasRef.current;
    const content = contentRef.current;
    if (!main || !content) return;

    // Calculate position in canvas coordinates (accounting for scroll and zoom)
    const scrollX = main.scrollLeft;
    const scrollY = main.scrollTop;
    const viewportCenterX = main.clientWidth / 2;
    const viewportCenterY = main.clientHeight / 2;
    
    // Convert viewport coordinates to canvas coordinates
    const canvasX = (scrollX + viewportCenterX) / (zoom / 100) - 100;
    const canvasY = (scrollY + viewportCenterY) / (zoom / 100) - 100;

    const baseItem = {
      type,
      x: Math.max(0, canvasX),
      y: Math.max(0, canvasY),
      z_index: canvasItems.length,
    };

    switch (type) {
      case 'text':
        createMutation.mutate({
          ...baseItem,
          width: 300,
          title: 'Text Card',
          content: '',
        });
        break;
      case 'image':
        createMutation.mutate({
          ...baseItem,
          width: 400,
          height: 300,
          title: 'Image',
          data: { placeholder: true },
        });
        break;
      case 'note':
        createMutation.mutate({
          ...baseItem,
          width: 250,
          height: 250,
          content: '',
          data: { colorIndex: Math.floor(Math.random() * 5) },
        });
        break;
      case 'section':
        createMutation.mutate({
          ...baseItem,
          width: 500,
          height: 400,
          title: 'Section',
          data: { color: '#6B46C1' },
        });
        break;
    }
    setShowToolbar(false);
  };

  // Handle item drag start
  const handleItemDragStart = (e, item) => {
    e.stopPropagation();
    const rect = e.currentTarget.getBoundingClientRect();
    const canvasRect = canvasRef.current.getBoundingClientRect();
    
    setDraggedItem(item);
    setDragOffset({
      x: e.clientX - rect.left - canvasRect.left + canvasRef.current.scrollLeft,
      y: e.clientY - rect.top - canvasRect.top + canvasRef.current.scrollTop,
    });
  };

  // Handle item drag
  const handleItemDrag = (e, item) => {
    if (!draggedItem || draggedItem.id !== item.id) return;
    e.stopPropagation();
    e.preventDefault();

    const canvasRect = canvasRef.current.getBoundingClientRect();
    const newX = (e.clientX - canvasRect.left + canvasRef.current.scrollLeft) / (zoom / 100) - dragOffset.x / (zoom / 100);
    const newY = (e.clientY - canvasRect.top + canvasRef.current.scrollTop) / (zoom / 100) - dragOffset.y / (zoom / 100);

    updateMutation.mutate({
      id: item.id,
      x: Math.max(0, newX),
      y: Math.max(0, newY),
    });
  };

  // Handle item drag end
  const handleItemDragEnd = () => {
    setDraggedItem(null);
    setDragOffset({ x: 0, y: 0 });
  };

  // Handle item update
  const handleItemUpdate = (updates) => {
    if (updates.duplicate) {
      // Duplicate item
      const item = canvasItems.find(i => i.id === updates.id);
      if (item) {
        createMutation.mutate({
          ...item,
          id: undefined,
          x: item.x + 20,
          y: item.y + 20,
          z_index: canvasItems.length,
        });
      }
    } else {
      updateMutation.mutate(updates);
    }
  };

  // Handle item delete
  const handleItemDelete = (id) => {
    deleteMutation.mutate(id);
  };

  // Handle image upload
  const handleImageUpload = async (itemId, file) => {
    if (!file) return;

    try {
      // Upload to Supabase Storage
      const fileExt = file.name.split('.').pop();
      const fileName = `${project.id}/${itemId}_${Date.now()}.${fileExt}`;
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('project-assets')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('project-assets')
        .getPublicUrl(fileName);

      // Update item with image URL
      updateMutation.mutate({
        id: itemId,
        data: { src: publicUrl, placeholder: false },
      });
    } catch (error) {
      console.error('Failed to upload image:', error);
      // Fallback to base64 for now
      const reader = new FileReader();
      reader.onloadend = () => {
        updateMutation.mutate({
          id: itemId,
          data: { src: reader.result, placeholder: false },
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleZoomIn = () => setZoom((prev) => Math.min(prev + 10, 200));
  const handleZoomOut = () => setZoom((prev) => Math.max(prev - 10, 50));

  const renderItem = (item) => {
    const commonProps = {
      id: item.id,
      x: item.x,
      y: item.y,
      width: item.width,
      height: item.height,
      onUpdate: handleItemUpdate,
      onDelete: handleItemDelete,
    };

    switch (item.type) {
      case 'text':
        return (
          <TextCard
            key={item.id}
            {...commonProps}
            content={item.content || ''}
            onMouseDown={(e) => handleItemDragStart(e, item)}
            onMouseUp={handleItemDragEnd}
            className="card-item"
          />
        );
      case 'image':
        return (
          <ImageCard
            key={item.id}
            {...commonProps}
            src={item.data?.src || item.data?.placeholder ? null : item.data?.src}
            onUpdate={(updates) => {
              if (updates.file) {
                handleImageUpload(item.id, updates.file);
              } else {
                handleItemUpdate(updates);
              }
            }}
            onMouseDown={(e) => handleItemDragStart(e, item)}
            onMouseUp={handleItemDragEnd}
            className="card-item"
          />
        );
      case 'note':
        return (
          <NoteCard
            key={item.id}
            {...commonProps}
            content={item.content || ''}
            colorIndex={item.data?.colorIndex || 0}
            onMouseDown={(e) => handleItemDragStart(e, item)}
            onMouseUp={handleItemDragEnd}
            className="card-item"
          />
        );
      case 'section':
        return (
          <SectionCard
            key={item.id}
            {...commonProps}
            title={item.title || 'Section'}
            data={item.data || {}}
            onMouseDown={(e) => handleItemDragStart(e, item)}
            onMouseUp={handleItemDragEnd}
            className="card-item"
          />
        );
      default:
        return null;
    }
  };

  if (isLoading) {
    return (
      <div className="h-full w-full flex items-center justify-center">
        <div className="text-gray-400">Loading canvas...</div>
      </div>
    );
  }

  return (
    <div className="relative h-full w-full">
      {/* Canvas Area */}
      <main
        ref={canvasRef}
        className="h-full w-full overflow-auto cursor-grab relative"
        style={{
          backgroundImage: 'radial-gradient(#D6D3D1 1px, transparent 1px)',
          backgroundSize: `${24 * (zoom / 100)}px ${24 * (zoom / 100)}px`,
        }}
      >
        {/* Infinite Canvas Container */}
        <div
          ref={contentRef}
          className="relative w-[5000px] h-[3000px] p-20 transform origin-top-left"
          style={{ transform: `scale(${zoom / 100})` }}
        >
          {/* Render all canvas items */}
          {canvasItems.map(renderItem)}

          {/* Empty state */}
          {canvasItems.length === 0 && (
            <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-2xl shadow-lg p-10 max-w-lg w-full text-center border border-gray-200">
              <div className="w-12 h-12 bg-purple-50 rounded-full flex items-center justify-center mx-auto mb-6 text-purple-600">
                <Layers className="w-6 h-6" />
              </div>
              <h2 className="text-2xl font-serif font-medium text-gray-900 mb-3">Project Canvas</h2>
              <p className="text-gray-500 mb-8 leading-relaxed">
                Your visual workspace for <strong>{project?.title}</strong>. Start by adding cards, notes, or images to organize your ideas.
              </p>
              <Button
                onClick={() => setShowToolbar(true)}
                className="w-full bg-purple-600 hover:bg-purple-700"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add First Card
              </Button>
            </div>
          )}
        </div>
      </main>

      {/* Floating Toolbar */}
      {showToolbar && (
        <div className="fixed bottom-24 right-8 z-50 bg-white rounded-lg shadow-xl border border-gray-200 p-2 toolbar">
          <div className="flex flex-col gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleCreateItem('text')}
              className="justify-start"
            >
              <FileText className="w-4 h-4 mr-2" />
              Text
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleCreateItem('image')}
              className="justify-start"
            >
              <ImageIcon className="w-4 h-4 mr-2" />
              Image
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleCreateItem('note')}
              className="justify-start"
            >
              <StickyNote className="w-4 h-4 mr-2" />
              Note
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleCreateItem('section')}
              className="justify-start"
            >
              <Type className="w-4 h-4 mr-2" />
              Section
            </Button>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setShowToolbar(false)}
            className="absolute top-1 right-1 h-6 w-6"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      )}

      {/* Floating Action Button */}
      <div className="fixed bottom-8 right-8 z-50">
        <DropdownMenu open={showToolbar} onOpenChange={setShowToolbar}>
          <DropdownMenuTrigger asChild>
            <Button
              size="lg"
              className="h-14 w-14 rounded-full bg-purple-600 hover:bg-purple-700 shadow-lg hover:shadow-xl transition-all transform hover:scale-105 active:scale-95"
              title="Add Card"
            >
              <Plus className="w-6 h-6" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" side="top" className="w-48">
            <DropdownMenuItem onClick={() => handleCreateItem('text')}>
              <FileText className="w-4 h-4 mr-2" />
              Text Card
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleCreateItem('image')}>
              <ImageIcon className="w-4 h-4 mr-2" />
              Image
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleCreateItem('note')}>
              <StickyNote className="w-4 h-4 mr-2" />
              Note
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleCreateItem('section')}>
              <Type className="w-4 h-4 mr-2" />
              Section
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
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
