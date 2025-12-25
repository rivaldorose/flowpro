import { useState, useCallback, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import type { CanvasObject, CanvasState } from '@/types/canvas';

/**
 * Canvas State Management Hook
 * Manages all canvas objects, selection, and operations
 */
export function useCanvas(projectId: string) {
  const queryClient = useQueryClient();
  const [state, setState] = useState<Partial<CanvasState>>({
    selectedObjectIds: [],
    zoom: 100,
    panX: 0,
    panY: 0,
    tool: 'select',
    gridVisible: true,
    snapToGrid: false,
    gridSize: 10,
  });

  // Load canvas items from database
  const { data: canvasItems = [], isLoading } = useQuery({
    queryKey: ['canvasItems', projectId],
    queryFn: async () => {
      if (!projectId) return [];
      const { data, error } = await supabase
        .from('canvas_items')
        .select('*')
        .eq('project_id', projectId)
        .order('z_index', { ascending: true });
      if (error) throw error;
      return (data || []).map(item => ({
        ...item,
        zIndex: item.z_index,
        parentId: item.parent_id,
        createdAt: item.created_at,
        updatedAt: item.updated_at,
        createdBy: item.created_by,
      })) as CanvasObject[];
    },
    enabled: !!projectId,
  });

  // Create object mutation
  const createMutation = useMutation({
    mutationFn: async (object: Partial<CanvasObject>) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('canvas_items')
        .insert({
          project_id: projectId,
          type: object.type,
          x: object.x || 0,
          y: object.y || 0,
          width: object.width || 300,
          height: object.height || 200,
          z_index: object.zIndex || 0,
          data: object.data || {},
          title: object.data?.label || object.data?.heading || '',
          content: object.data?.content || '',
          created_by: user.id,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['canvasItems', projectId] });
    },
  });

  // Update object mutation
  const updateMutation = useMutation({
    mutationFn: async ({ id, ...updates }: Partial<CanvasObject> & { id: string }) => {
      const { data, error } = await supabase
        .from('canvas_items')
        .update({
          x: updates.x,
          y: updates.y,
          width: updates.width,
          height: updates.height,
          z_index: updates.zIndex,
          data: updates.data,
          title: updates.data?.label || updates.data?.heading || '',
          content: updates.data?.content || '',
          updated_at: new Date().toISOString(),
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['canvasItems', projectId] });
    },
  });

  // Delete object mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('canvas_items')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['canvasItems', projectId] });
    },
  });

  // Actions
  const addObject = useCallback((object: Partial<CanvasObject>) => {
    createMutation.mutate(object);
  }, [createMutation]);

  const updateObject = useCallback((id: string, updates: Partial<CanvasObject>) => {
    updateMutation.mutate({ id, ...updates });
  }, [updateMutation]);

  const deleteObject = useCallback((id: string) => {
    deleteMutation.mutate(id);
  }, [deleteMutation]);

  const selectObject = useCallback((id: string, addToSelection = false) => {
    setState(prev => ({
      ...prev,
      selectedObjectIds: addToSelection
        ? [...(prev.selectedObjectIds || []), id]
        : [id],
    }));
  }, []);

  const deselectAll = useCallback(() => {
    setState(prev => ({ ...prev, selectedObjectIds: [] }));
  }, []);

  const selectAll = useCallback(() => {
    setState(prev => ({ ...prev, selectedObjectIds: canvasItems.map(obj => obj.id) }));
  }, [canvasItems]);

  const setZoom = useCallback((zoom: number) => {
    setState(prev => ({ ...prev, zoom: Math.max(1, Math.min(6400, zoom)) }));
  }, []);

  const setPan = useCallback((x: number, y: number) => {
    setState(prev => ({ ...prev, panX: x, panY: y }));
  }, []);

  const setTool = useCallback((tool: CanvasState['tool']) => {
    setState(prev => ({ ...prev, tool }));
  }, []);

  return {
    objects: canvasItems,
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
    setState,
  };
}

