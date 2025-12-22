import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Button } from "@/components/ui/button";
import { RefreshCw, CheckCircle2, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function StatusSyncButton({ projectId, frames }) {
  const queryClient = useQueryClient();
  const [syncing, setSyncing] = useState(false);

  const syncToStoryDeck = useMutation({
    mutationFn: async () => {
      const storydeckFrames = frames.filter(f => f.uploaded_from === 'StoryDeck');
      
      const { data } = await base44.functions.invoke('storydeckSync', {
        action: 'syncStatus',
        project_id: projectId,
        frames: storydeckFrames
      });
      
      return data;
    },
    onSuccess: (data) => {
      toast.success(`Synced ${data.updates.length} statuses to StoryDeck`);
      queryClient.invalidateQueries(['storyboardFrames', projectId]);
    },
    onError: (error) => {
      toast.error('Sync failed: ' + error.message);
    }
  });

  const syncFromStoryDeck = useMutation({
    mutationFn: async () => {
      const storydeckFrames = frames.filter(f => f.uploaded_from === 'StoryDeck');
      
      const { data } = await base44.functions.invoke('storydeckSync', {
        action: 'syncFromStoryDeck',
        project_id: projectId,
        frames: storydeckFrames
      });
      
      // Update frame statuses
      for (const update of data.updates) {
        await base44.entities.StoryboardFrame.update(update.frame_id, {
          status: update.new_status
        });
      }
      
      return data;
    },
    onSuccess: (data) => {
      toast.success(`Updated ${data.updates.length} statuses from StoryDeck`);
      queryClient.invalidateQueries(['storyboardFrames', projectId]);
    },
    onError: (error) => {
      toast.error('Sync failed: ' + error.message);
    }
  });

  const storydeckFrameCount = frames.filter(f => f.uploaded_from === 'StoryDeck').length;

  if (storydeckFrameCount === 0) {
    return null;
  }

  const isLoading = syncToStoryDeck.isPending || syncFromStoryDeck.isPending;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="outline" 
          className="border-gray-700 text-gray-300 gap-2"
          disabled={isLoading}
        >
          {isLoading ? (
            <RefreshCw className="w-4 h-4 animate-spin" />
          ) : (
            <RefreshCw className="w-4 h-4" />
          )}
          Sync StoryDeck
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="bg-[#22262b] border-gray-700">
        <DropdownMenuItem 
          onClick={() => syncToStoryDeck.mutate()}
          className="text-white hover:bg-[#1a1d21]"
        >
          <CheckCircle2 className="w-4 h-4 mr-2 text-emerald-400" />
          Push Status to StoryDeck
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => syncFromStoryDeck.mutate()}
          className="text-white hover:bg-[#1a1d21]"
        >
          <RefreshCw className="w-4 h-4 mr-2 text-blue-400" />
          Pull Status from StoryDeck
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}