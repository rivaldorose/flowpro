import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Loader2, Link as LinkIcon, CheckCircle2, RefreshCw, Download } from 'lucide-react';
import { toast } from 'sonner';

export default function StoryDeckConnect({ projectId, open, onOpenChange }) {
  const queryClient = useQueryClient();
  const [step, setStep] = useState('connect');
  const [boardId, setBoardId] = useState('');
  const [importData, setImportData] = useState(null);
  const [autoSync, setAutoSync] = useState(false);

  const importBoardMutation = useMutation({
    mutationFn: async () => {
      const { data } = await base44.functions.invoke('storydeckSync', {
        action: 'importBoard',
        project_id: projectId,
        board_id: boardId
      });
      return data;
    },
    onSuccess: (data) => {
      setImportData(data);
      setStep('review');
      toast.success('StoryDeck board imported successfully');
    },
    onError: (error) => {
      toast.error('Failed to import board: ' + error.message);
    }
  });

  const importShotListMutation = useMutation({
    mutationFn: async () => {
      const { data } = await base44.functions.invoke('storydeckSync', {
        action: 'importShotList',
        project_id: projectId,
        board_id: boardId
      });
      return data;
    },
    onSuccess: async (data) => {
      // Create shots from imported data
      const shotsToCreate = data.shots.map(s => ({
        project_id: projectId,
        shot_number: s.shot_number,
        scene_description: s.scene_description,
        shot_type: s.shot_type,
        camera_angle: s.camera_angle,
        priority: s.priority,
        duration: s.duration,
        notes: s.notes,
        status: 'Not Shot'
      }));

      await base44.entities.Shot.bulkCreate(shotsToCreate);
      queryClient.invalidateQueries(['shots', projectId]);
      toast.success(`Imported ${data.shots.length} shots from StoryDeck`);
      setStep('complete');
    },
    onError: (error) => {
      toast.error('Failed to import shot list: ' + error.message);
    }
  });

  const createFramesMutation = useMutation({
    mutationFn: async (frames) => {
      // Get existing shots for auto-mapping
      const shots = await base44.entities.Shot.filter({ project_id: projectId });
      
      // Auto-map frames to shots
      const { data: mappingResult } = await base44.functions.invoke('storydeckSync', {
        action: 'autoMapFrames',
        frames: frames,
        shots: shots
      });

      // Create storyboard frames
      const framesToCreate = mappingResult.mapped.map((m, idx) => ({
        project_id: projectId,
        scene_number: m.frame.scene_number,
        shot_number: m.frame.shot_number,
        shot_description: m.frame.shot_description,
        camera_shot_type: m.frame.camera_shot_type,
        camera_angle: m.frame.camera_angle,
        frame_image: m.frame.frame_image,
        status: m.frame.status,
        duration_seconds: m.frame.duration_seconds,
        sequence_order: idx + 1,
        linked_shot_id: m.shot_id,
        uploaded_from: 'StoryDeck',
        storydeck_board_id: boardId
      }));

      const created = await base44.entities.StoryboardFrame.bulkCreate(framesToCreate);
      
      // Update shots with linked frames
      for (let i = 0; i < created.length; i++) {
        const frame = created[i];
        const mapping = mappingResult.mapped[i];
        if (mapping.shot_id) {
          await base44.entities.Shot.update(mapping.shot_id, {
            linked_storyboard_id: frame.id
          });
        }
      }

      return { created, unmapped: mappingResult.unmapped };
    },
    onSuccess: (result) => {
      queryClient.invalidateQueries(['storyboardFrames', projectId]);
      queryClient.invalidateQueries(['shots', projectId]);
      
      if (result.unmapped.length > 0) {
        toast.warning(`Imported ${result.created.length} frames, ${result.unmapped.length} couldn't be auto-mapped`);
      } else {
        toast.success(`Successfully imported and mapped ${result.created.length} frames`);
      }
      
      setStep('complete');
    },
    onError: (error) => {
      toast.error('Failed to create frames: ' + error.message);
    }
  });

  const handleImportBoard = () => {
    if (!boardId.trim()) {
      toast.error('Please enter a StoryDeck Board ID');
      return;
    }
    importBoardMutation.mutate();
  };

  const handleConfirmImport = () => {
    if (importData?.frames) {
      createFramesMutation.mutate(importData.frames);
    }
  };

  const handleImportShotList = () => {
    if (!boardId.trim()) {
      toast.error('Please enter a StoryDeck Board ID');
      return;
    }
    importShotListMutation.mutate();
  };

  const handleReset = () => {
    setStep('connect');
    setBoardId('');
    setImportData(null);
    setAutoSync(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-[#22262b] border-gray-700 text-white max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <LinkIcon className="w-5 h-5 text-emerald-400" />
            Connect StoryDeck
          </DialogTitle>
        </DialogHeader>

        {step === 'connect' && (
          <div className="space-y-6">
            <div className="space-y-2">
              <Label>StoryDeck Board ID</Label>
              <Input
                value={boardId}
                onChange={(e) => setBoardId(e.target.value)}
                placeholder="Enter your StoryDeck board ID"
                className="bg-[#1a1d21] border-gray-700"
              />
              <p className="text-xs text-gray-500">
                Find this in your StoryDeck board URL: storydeck.com/board/<span className="text-emerald-400">[board-id]</span>
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div 
                className="p-6 border border-gray-700 rounded-lg hover:border-emerald-500 transition-colors cursor-pointer group"
                onClick={handleImportShotList}
              >
                <Download className="w-8 h-8 text-emerald-400 mb-3" />
                <h3 className="font-semibold text-white mb-2">Import Shot List</h3>
                <p className="text-sm text-gray-400">
                  Import shot list data from StoryDeck to create shots in FlowPro
                </p>
                <Button 
                  className="mt-4 w-full bg-emerald-500 hover:bg-emerald-600"
                  disabled={importShotListMutation.isPending}
                >
                  {importShotListMutation.isPending ? (
                    <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Importing...</>
                  ) : (
                    'Import Shots'
                  )}
                </Button>
              </div>

              <div 
                className="p-6 border border-gray-700 rounded-lg hover:border-emerald-500 transition-colors cursor-pointer group"
                onClick={handleImportBoard}
              >
                <LinkIcon className="w-8 h-8 text-blue-400 mb-3" />
                <h3 className="font-semibold text-white mb-2">Import Storyboard</h3>
                <p className="text-sm text-gray-400">
                  Import storyboard frames and auto-map to existing shots
                </p>
                <Button 
                  className="mt-4 w-full bg-blue-500 hover:bg-blue-600"
                  disabled={importBoardMutation.isPending}
                >
                  {importBoardMutation.isPending ? (
                    <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Importing...</>
                  ) : (
                    'Import Frames'
                  )}
                </Button>
              </div>
            </div>

            <div className="bg-[#1a1d21] rounded-lg p-4 border border-gray-800">
              <div className="flex items-start gap-3">
                <RefreshCw className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-medium text-white mb-1">Auto-Sync Features</h4>
                  <ul className="text-sm text-gray-400 space-y-1">
                    <li>• Automatic mapping of frames to shots by shot number</li>
                    <li>• Bidirectional status synchronization</li>
                    <li>• Real-time updates between FlowPro and StoryDeck</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

        {step === 'review' && importData && (
          <div className="space-y-4">
            <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                <h3 className="font-semibold text-white">Ready to Import</h3>
              </div>
              <p className="text-sm text-gray-400">
                Found {importData.frames.length} frames from StoryDeck board
              </p>
            </div>

            <div className="max-h-64 overflow-y-auto space-y-2">
              {importData.frames.map((frame, idx) => (
                <div key={idx} className="bg-[#1a1d21] rounded-lg p-3 border border-gray-800">
                  <div className="flex items-center gap-3">
                    <img 
                      src={frame.frame_image} 
                      alt="" 
                      className="w-16 h-16 rounded object-cover"
                    />
                    <div className="flex-1">
                      <p className="text-white font-medium">Shot {frame.shot_number}</p>
                      <p className="text-sm text-gray-400 line-clamp-1">{frame.shot_description}</p>
                      <div className="flex gap-2 mt-1">
                        <Badge variant="outline" className="border-gray-700 text-gray-400 text-xs">
                          {frame.camera_shot_type}
                        </Badge>
                        <Badge variant="outline" className="border-gray-700 text-gray-400 text-xs">
                          {frame.camera_angle}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex gap-3">
              <Button 
                variant="outline" 
                onClick={handleReset}
                className="flex-1 border-gray-700 text-gray-300"
              >
                Cancel
              </Button>
              <Button 
                onClick={handleConfirmImport}
                disabled={createFramesMutation.isPending}
                className="flex-1 bg-emerald-500 hover:bg-emerald-600"
              >
                {createFramesMutation.isPending ? (
                  <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Importing...</>
                ) : (
                  'Confirm Import'
                )}
              </Button>
            </div>
          </div>
        )}

        {step === 'complete' && (
          <div className="text-center py-8">
            <CheckCircle2 className="w-16 h-16 text-emerald-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">Import Complete!</h3>
            <p className="text-gray-400 mb-6">
              Your StoryDeck content has been imported and synced
            </p>
            <Button 
              onClick={() => onOpenChange(false)}
              className="bg-emerald-500 hover:bg-emerald-600"
            >
              Done
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}