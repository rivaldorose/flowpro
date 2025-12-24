import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Shot, StoryboardFrame } from '@/api/entities';
import { Film, Plus, Upload, Grid3X3, List as ListIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import StoryDeckConnect from '@/components/storyboard/StoryDeckConnect';

const statusColors = {
  'Not Started': 'bg-gray-500/20 text-gray-400 border-gray-500/30',
  'Sketched': 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  'Approved': 'bg-green-500/20 text-green-400 border-green-500/30',
  'Shot': 'bg-purple-500/20 text-purple-400 border-purple-500/30',
  'In Progress': 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  'Completed': 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
  'Rejected': 'bg-red-500/20 text-red-400 border-red-500/30',
};

/**
 * Storyboard Mode - Storyboard view
 * Migrated from Storyboard page
 */
export default function StoryboardMode({ project }) {
  const [viewMode, setViewMode] = useState('storyboard');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showStoryDeckModal, setShowStoryDeckModal] = useState(false);
  const [filters, setFilters] = useState({ scene: 'all', status: 'all', hasStoryboard: 'all' });

  const { data: shots = [], isLoading: shotsLoading } = useQuery({
    queryKey: ['shots', project?.id],
    queryFn: () => Shot.filter({ project_id: project?.id }),
    enabled: !!project?.id,
  });

  const { data: frames = [] } = useQuery({
    queryKey: ['storyboardFrames', project?.id],
    queryFn: () => StoryboardFrame.filter({ project_id: project?.id }),
    enabled: !!project?.id,
  });

  // Map frames to shots
  const frameMap = frames.reduce((acc, f) => ({ ...acc, [f.linked_shot_id]: f }), {});

  // Group shots by scene
  const shotsByScene = shots.reduce((acc, shot) => {
    const sceneNum = Math.floor(shot.shot_number / 100) || 1;
    if (!acc[sceneNum]) acc[sceneNum] = [];
    acc[sceneNum].push(shot);
    return acc;
  }, {});

  const filteredShots = shots.filter(s => {
    const sceneNum = Math.floor(s.shot_number / 100) || 1;
    if (filters.scene !== 'all' && sceneNum !== parseInt(filters.scene)) return false;
    if (filters.status !== 'all' && s.status !== filters.status) return false;
    if (filters.hasStoryboard === 'with' && !frameMap[s.id]) return false;
    if (filters.hasStoryboard === 'without' && frameMap[s.id]) return false;
    return true;
  });

  if (shotsLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Shot List & Storyboard</h1>
            <p className="text-gray-500 mt-1">{project?.title}</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setShowStoryDeckModal(true)}>
              <Upload className="w-4 h-4 mr-2" />
              StoryDeck Sync
            </Button>
            <Button onClick={() => setShowUploadModal(true)} className="bg-purple-600 hover:bg-purple-700">
              <Plus className="w-4 h-4 mr-2" />
              Add Frame
            </Button>
          </div>
        </div>

        {/* Filters */}
        <div className="flex gap-4">
          <Select value={filters.scene} onValueChange={(v) => setFilters({ ...filters, scene: v })}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Scene" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Scenes</SelectItem>
              {Object.keys(shotsByScene).map(scene => (
                <SelectItem key={scene} value={scene}>Scene {scene}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={filters.status} onValueChange={(v) => setFilters({ ...filters, status: v })}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              {Object.keys(statusColors).map(status => (
                <SelectItem key={status} value={status}>{status}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* View Mode Toggle */}
        <Tabs value={viewMode} onValueChange={setViewMode}>
          <TabsList>
            <TabsTrigger value="storyboard">
              <Grid3X3 className="w-4 h-4 mr-2" />
              Storyboard
            </TabsTrigger>
            <TabsTrigger value="list">
              <ListIcon className="w-4 h-4 mr-2" />
              List
            </TabsTrigger>
          </TabsList>

          <TabsContent value="storyboard" className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {filteredShots.map(shot => {
                const frame = frameMap[shot.id];
                return (
                  <div
                    key={shot.id}
                    className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow"
                  >
                    <div className="aspect-video bg-gray-100 rounded mb-2 flex items-center justify-center">
                      {frame?.image_url ? (
                        <img src={frame.image_url} alt={`Shot ${shot.shot_number}`} className="w-full h-full object-cover rounded" />
                      ) : (
                        <Film className="w-8 h-8 text-gray-400" />
                      )}
                    </div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-semibold text-sm">Shot {shot.shot_number}</span>
                      <Badge className={statusColors[frame?.status || 'Not Started']} variant="outline">
                        {frame?.status || 'Not Started'}
                      </Badge>
                    </div>
                    {shot.scene_description && (
                      <p className="text-xs text-gray-600 line-clamp-2">{shot.scene_description}</p>
                    )}
                  </div>
                );
              })}
              {filteredShots.length === 0 && (
                <div className="col-span-full text-center py-12 text-gray-500">
                  No shots found. Add shots to your project first.
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="list" className="space-y-2">
            <div className="bg-white rounded-lg border border-gray-200 divide-y">
              {filteredShots.map(shot => {
                const frame = frameMap[shot.id];
                return (
                  <div key={shot.id} className="p-4 hover:bg-gray-50">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <span className="font-semibold w-20">Shot {shot.shot_number}</span>
                        <div className="flex-1">
                          {shot.scene_description && (
                            <p className="text-sm text-gray-700">{shot.scene_description}</p>
                          )}
                        </div>
                        <Badge className={statusColors[frame?.status || 'Not Started']} variant="outline">
                          {frame?.status || 'Not Started'}
                        </Badge>
                      </div>
                    </div>
                  </div>
                );
              })}
              {filteredShots.length === 0 && (
                <div className="p-12 text-center text-gray-500">
                  No shots found. Add shots to your project first.
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* StoryDeck Modal */}
      {showStoryDeckModal && (
        <Dialog open={showStoryDeckModal} onOpenChange={setShowStoryDeckModal}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>StoryDeck Integration</DialogTitle>
            </DialogHeader>
            <StoryDeckConnect projectId={project?.id} onClose={() => setShowStoryDeckModal(false)} />
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}

