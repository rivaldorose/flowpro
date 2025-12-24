import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Project, Shot, StoryboardFrame } from '@/api/entities';
import { ArrowLeft, Plus, Upload, Grid3X3, List as ListIcon, SplitSquareHorizontal, Image as ImageIcon, Link as LinkIcon } from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '../utils';
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import StoryDeckConnect from '../components/storyboard/StoryDeckConnect';
import StatusSyncButton from '../components/storyboard/StatusSyncButton';

const statusColors = {
  'Not Started': 'bg-gray-500/20 text-gray-400 border-gray-500/30',
  'Sketched': 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  'Approved': 'bg-green-500/20 text-green-400 border-green-500/30',
  'Shot': 'bg-purple-500/20 text-purple-400 border-purple-500/30',
  'In Progress': 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  'Completed': 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
  'Rejected': 'bg-red-500/20 text-red-400 border-red-500/30',
};

export default function Storyboard() {
  const queryClient = useQueryClient();
  const urlParams = new URLSearchParams(window.location.search);
  const projectId = urlParams.get('project_id');
  
  const [viewMode, setViewMode] = useState('storyboard');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showStoryDeckModal, setShowStoryDeckModal] = useState(false);
  const [filters, setFilters] = useState({ scene: 'all', status: 'all', hasStoryboard: 'all' });
  const [selectedShot, setSelectedShot] = useState(null);

  const { data: project } = useQuery({
    queryKey: ['project', projectId],
    queryFn: async () => {
      const projects = await Project.filter({ id: projectId });
      return projects[0];
    },
    enabled: !!projectId,
  });

  const { data: shots = [], isLoading: shotsLoading } = useQuery({
    queryKey: ['shots', projectId],
    queryFn: () => Shot.filter({ project_id: projectId }),
    enabled: !!projectId,
  });

  const { data: frames = [] } = useQuery({
    queryKey: ['storyboardFrames', projectId],
    queryFn: () => StoryboardFrame.filter({ project_id: projectId }),
    enabled: !!projectId,
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

  if (!projectId) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-400">Geen project geselecteerd</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link to={createPageUrl(`ProjectDetail?id=${projectId}`)}>
            <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-white">Shot List & Storyboard</h1>
            <p className="text-gray-500 mt-1">{project?.title}</p>
          </div>
        </div>

        <div className="flex gap-2">
          <StatusSyncButton projectId={projectId} frames={frames} />
          <Button 
            onClick={() => setShowStoryDeckModal(true)}
            variant="outline" 
            className="border-gray-700 text-gray-300 gap-2"
          >
            <LinkIcon className="w-4 h-4" />
            StoryDeck
          </Button>
          <Button 
            onClick={() => setShowUploadModal(true)}
            variant="outline" 
            className="border-gray-700 text-gray-300 gap-2"
          >
            <Upload className="w-4 h-4" />
            Upload
          </Button>
          <Link to={createPageUrl(`Shots?project_id=${projectId}`)}>
            <Button className="bg-emerald-500 hover:bg-emerald-600 gap-2">
              <Plus className="w-4 h-4" />
              Add Shot
            </Button>
          </Link>
        </div>
      </div>

      {/* View Mode Toggle & Filters */}
      <div className="bg-[#22262b] rounded-2xl p-4 border border-gray-800/50">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="flex gap-3">
            <Select value={filters.scene} onValueChange={(v) => setFilters(prev => ({ ...prev, scene: v }))}>
              <SelectTrigger className="w-32 bg-[#1a1d21] border-gray-700 text-white">
                <SelectValue placeholder="Scene" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Scenes</SelectItem>
                {Object.keys(shotsByScene).sort().map(scene => (
                  <SelectItem key={scene} value={scene}>Scene {scene}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={filters.status} onValueChange={(v) => setFilters(prev => ({ ...prev, status: v }))}>
              <SelectTrigger className="w-40 bg-[#1a1d21] border-gray-700 text-white">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="Not Shot">Not Shot</SelectItem>
                <SelectItem value="In Progress">In Progress</SelectItem>
                <SelectItem value="Completed">Completed</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filters.hasStoryboard} onValueChange={(v) => setFilters(prev => ({ ...prev, hasStoryboard: v }))}>
              <SelectTrigger className="w-44 bg-[#1a1d21] border-gray-700 text-white">
                <SelectValue placeholder="Storyboard" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Shots</SelectItem>
                <SelectItem value="with">With Storyboard</SelectItem>
                <SelectItem value="without">Without Storyboard</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex border border-gray-700 rounded-lg overflow-hidden">
            <Button
              variant={viewMode === 'list' ? 'secondary' : 'ghost'}
              size="icon"
              onClick={() => setViewMode('list')}
              className={viewMode === 'list' ? 'bg-emerald-500/20 text-emerald-400' : 'text-gray-400'}
            >
              <ListIcon className="w-4 h-4" />
            </Button>
            <Button
              variant={viewMode === 'storyboard' ? 'secondary' : 'ghost'}
              size="icon"
              onClick={() => setViewMode('storyboard')}
              className={viewMode === 'storyboard' ? 'bg-emerald-500/20 text-emerald-400' : 'text-gray-400'}
            >
              <Grid3X3 className="w-4 h-4" />
            </Button>
            <Button
              variant={viewMode === 'split' ? 'secondary' : 'ghost'}
              size="icon"
              onClick={() => setViewMode('split')}
              className={viewMode === 'split' ? 'bg-emerald-500/20 text-emerald-400' : 'text-gray-400'}
            >
              <SplitSquareHorizontal className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Content based on view mode */}
      {shotsLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[1, 2, 3].map(i => <Skeleton key={i} className="h-64 bg-[#22262b]" />)}
        </div>
      ) : (
        <>
          {viewMode === 'list' && (
            <div className="bg-[#22262b] rounded-2xl border border-gray-800/50 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-[#1a1d21] border-b border-gray-800">
                    <tr>
                      <th className="text-left p-4 text-sm font-medium text-gray-400">Thumbnail</th>
                      <th className="text-left p-4 text-sm font-medium text-gray-400">Shot #</th>
                      <th className="text-left p-4 text-sm font-medium text-gray-400">Description</th>
                      <th className="text-left p-4 text-sm font-medium text-gray-400">Shot Type</th>
                      <th className="text-left p-4 text-sm font-medium text-gray-400">Angle</th>
                      <th className="text-left p-4 text-sm font-medium text-gray-400">Status</th>
                      <th className="text-left p-4 text-sm font-medium text-gray-400">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredShots.map(shot => {
                      const frame = frameMap[shot.id];
                      return (
                        <tr key={shot.id} className="border-b border-gray-800 hover:bg-[#1a1d21] transition-colors">
                          <td className="p-4">
                            <div 
                              className="w-16 h-16 rounded-lg bg-gradient-to-br from-gray-700 to-gray-800 flex items-center justify-center cursor-pointer overflow-hidden"
                              onClick={() => setSelectedShot(shot)}
                            >
                              {frame?.frame_image ? (
                                <img src={frame.frame_image} alt="" className="w-full h-full object-cover" />
                              ) : (
                                <ImageIcon className="w-6 h-6 text-gray-500" />
                              )}
                            </div>
                          </td>
                          <td className="p-4">
                            <span className="font-mono text-emerald-400">{shot.shot_number}</span>
                          </td>
                          <td className="p-4">
                            <p className="text-white text-sm line-clamp-2">{shot.scene_description}</p>
                          </td>
                          <td className="p-4">
                            <Badge variant="outline" className="border-gray-700 text-gray-300">
                              {shot.shot_type}
                            </Badge>
                          </td>
                          <td className="p-4">
                            <span className="text-gray-400 text-sm">{shot.camera_angle}</span>
                          </td>
                          <td className="p-4">
                            <Badge variant="outline" className={statusColors[shot.status]}>
                              {shot.status}
                            </Badge>
                          </td>
                          <td className="p-4">
                            <Button 
                              size="sm" 
                              variant="ghost"
                              onClick={() => setSelectedShot(shot)}
                              className="text-gray-400 hover:text-white"
                            >
                              View
                            </Button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {viewMode === 'storyboard' && (
            <div className="space-y-6">
              {Object.keys(shotsByScene).sort().map(sceneNum => {
                const sceneShots = shotsByScene[sceneNum].filter(s => 
                  filteredShots.includes(s)
                );
                if (sceneShots.length === 0) return null;

                return (
                  <div key={sceneNum} className="space-y-4">
                    <h3 className="text-lg font-semibold text-white">Scene {sceneNum}</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                      {sceneShots.map(shot => {
                        const frame = frameMap[shot.id];
                        return (
                          <div 
                            key={shot.id}
                            className="bg-[#22262b] rounded-xl border border-gray-800/50 overflow-hidden hover:border-gray-700 transition-all cursor-pointer"
                            onClick={() => setSelectedShot(shot)}
                          >
                            <div className="aspect-video bg-gradient-to-br from-gray-700 to-gray-800 flex items-center justify-center relative">
                              {frame?.frame_image ? (
                                <img src={frame.frame_image} alt="" className="w-full h-full object-cover" />
                              ) : (
                                <ImageIcon className="w-12 h-12 text-gray-600" />
                              )}
                              <div className="absolute top-3 left-3">
                                <div className="bg-black/70 rounded-lg px-3 py-1">
                                  <span className="text-white font-mono text-sm">Shot {shot.shot_number}</span>
                                </div>
                              </div>
                              {frame?.uploaded_from === 'StoryDeck' && (
                                <div className="absolute top-3 right-3">
                                  <LinkIcon className="w-5 h-5 text-emerald-400" />
                                </div>
                              )}
                            </div>
                            <div className="p-4 space-y-2">
                              <p className="text-white text-sm font-medium line-clamp-2">{shot.scene_description}</p>
                              <div className="flex items-center gap-2">
                                <Badge variant="outline" className="border-gray-700 text-gray-400 text-xs">
                                  {shot.shot_type}
                                </Badge>
                                <Badge variant="outline" className="border-gray-700 text-gray-400 text-xs">
                                  {shot.camera_angle}
                                </Badge>
                              </div>
                              {frame ? (
                                <Badge variant="outline" className={statusColors[frame.status]}>
                                  {frame.status}
                                </Badge>
                              ) : (
                                <p className="text-xs text-gray-500">⚠️ No storyboard</p>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {viewMode === 'split' && (
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
              {/* Left: Shot List */}
              <div className="lg:col-span-2 bg-[#22262b] rounded-2xl border border-gray-800/50 p-4 max-h-[70vh] overflow-y-auto">
                <h3 className="font-semibold text-white mb-4">Shots</h3>
                <div className="space-y-2">
                  {filteredShots.map(shot => {
                    const frame = frameMap[shot.id];
                    return (
                      <div
                        key={shot.id}
                        onClick={() => setSelectedShot(shot)}
                        className={`p-3 rounded-lg border transition-colors cursor-pointer ${
                          selectedShot?.id === shot.id
                            ? 'bg-emerald-500/20 border-emerald-500'
                            : 'bg-[#1a1d21] border-gray-800 hover:border-gray-700'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded bg-gradient-to-br from-gray-700 to-gray-800 flex items-center justify-center flex-shrink-0 overflow-hidden">
                            {frame?.frame_image ? (
                              <img src={frame.frame_image} alt="" className="w-full h-full object-cover" />
                            ) : (
                              <ImageIcon className="w-5 h-5 text-gray-500" />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-white text-sm font-medium">Shot {shot.shot_number}</p>
                            <p className="text-gray-500 text-xs truncate">{shot.scene_description}</p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Right: Storyboard Detail */}
              <div className="lg:col-span-3 bg-[#22262b] rounded-2xl border border-gray-800/50 p-6">
                {selectedShot ? (
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-xl font-semibold text-white mb-2">
                        Shot {selectedShot.shot_number}
                      </h3>
                      <p className="text-gray-400">{selectedShot.scene_description}</p>
                    </div>

                    {frameMap[selectedShot.id] ? (
                      <div className="space-y-4">
                        <div className="aspect-video bg-gradient-to-br from-gray-700 to-gray-800 rounded-lg overflow-hidden">
                          <img 
                            src={frameMap[selectedShot.id].frame_image} 
                            alt="" 
                            className="w-full h-full object-contain"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <p className="text-gray-500">Shot Type</p>
                            <p className="text-white">{frameMap[selectedShot.id].camera_shot_type}</p>
                          </div>
                          <div>
                            <p className="text-gray-500">Angle</p>
                            <p className="text-white">{frameMap[selectedShot.id].camera_angle}</p>
                          </div>
                          {frameMap[selectedShot.id].camera_movement && (
                            <div>
                              <p className="text-gray-500">Movement</p>
                              <p className="text-white">{frameMap[selectedShot.id].camera_movement}</p>
                            </div>
                          )}
                          {frameMap[selectedShot.id].duration_seconds && (
                            <div>
                              <p className="text-gray-500">Duration</p>
                              <p className="text-white">{frameMap[selectedShot.id].duration_seconds}s</p>
                            </div>
                          )}
                        </div>
                      </div>
                    ) : (
                      <div className="aspect-video bg-[#1a1d21] rounded-lg border border-gray-800 flex flex-col items-center justify-center">
                        <ImageIcon className="w-16 h-16 text-gray-600 mb-4" />
                        <p className="text-gray-400 mb-4">No storyboard for this shot</p>
                        <Button className="bg-emerald-500 hover:bg-emerald-600">
                          Add Storyboard
                        </Button>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="h-full flex items-center justify-center text-gray-500">
                    Select a shot to view storyboard
                  </div>
                )}
              </div>
            </div>
          )}
        </>
      )}

      {/* Upload Modal */}
      <Dialog open={showUploadModal} onOpenChange={setShowUploadModal}>
        <DialogContent className="bg-[#22262b] border-gray-700 text-white max-w-2xl">
          <DialogHeader>
            <DialogTitle>Upload Storyboard</DialogTitle>
          </DialogHeader>

          <Tabs defaultValue="frames" className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-[#1a1d21]">
              <TabsTrigger value="frames">Individual Frames</TabsTrigger>
              <TabsTrigger value="file">Full File</TabsTrigger>
            </TabsList>

            <TabsContent value="frames" className="space-y-4">
              <div className="text-center py-12 border-2 border-dashed border-gray-700 rounded-lg">
                <Upload className="w-12 h-12 text-gray-500 mx-auto mb-4" />
                <p className="text-gray-400 mb-2">Upload images for individual frames</p>
                <p className="text-gray-500 text-sm mb-4">PNG, JPG - Multiple files supported</p>
                <Button className="bg-emerald-500 hover:bg-emerald-600">
                  Choose Images
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="file" className="space-y-4">
              <div className="text-center py-12 border-2 border-dashed border-gray-700 rounded-lg">
                <Upload className="w-12 h-12 text-gray-500 mx-auto mb-4" />
                <p className="text-gray-400 mb-2">Upload complete storyboard file</p>
                <p className="text-gray-500 text-sm mb-4">PDF, PSD, AI accepted</p>
                <Button className="bg-emerald-500 hover:bg-emerald-600">
                  Choose File
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>

      {/* StoryDeck Connect Modal */}
      <StoryDeckConnect 
        projectId={projectId}
        open={showStoryDeckModal}
        onOpenChange={setShowStoryDeckModal}
      />
    </div>
  );
}