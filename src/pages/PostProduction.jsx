import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Plus, Video, Upload, Clock, CheckCircle2, Trash2, User, Calendar, FileText } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from 'date-fns';
import { nl } from 'date-fns/locale';

const POST_STATUSES = ['Not Started', 'Rough Cut', 'Fine Cut', 'Color Grading', 'Sound Design', 'Final Export', 'Delivered'];

const statusColors = {
  'Not Started': 'bg-gray-500/20 text-gray-400 border-gray-500/30',
  'Rough Cut': 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  'Fine Cut': 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30',
  'Color Grading': 'bg-purple-500/20 text-purple-400 border-purple-500/30',
  'Sound Design': 'bg-pink-500/20 text-pink-400 border-pink-500/30',
  'Final Export': 'bg-orange-500/20 text-orange-400 border-orange-500/30',
  'Delivered': 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
};

export default function PostProduction() {
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [showVersionDialog, setShowVersionDialog] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  const [uploadingFile, setUploadingFile] = useState(false);

  const [formData, setFormData] = useState({
    project_id: '',
    editor_id: '',
    status: 'Not Started',
    draft_version: 1,
    feedback: '',
    due_date: '',
    video_link: ''
  });

  const [versionData, setVersionData] = useState({
    video_link: '',
    feedback: ''
  });

  const { data: posts = [], isLoading } = useQuery({
    queryKey: ['postProduction'],
    queryFn: () => base44.entities.PostProduction.list('-updated_date'),
  });

  const { data: projects = [] } = useQuery({
    queryKey: ['projects'],
    queryFn: () => base44.entities.Project.list(),
  });

  const { data: crew = [] } = useQuery({
    queryKey: ['crew'],
    queryFn: () => base44.entities.CrewMember.list(),
  });

  const { data: versions = [] } = useQuery({
    queryKey: ['postVersions'],
    queryFn: () => base44.entities.PostVersion.list('-version_number'),
  });

  const createMutation = useMutation({
    mutationFn: (data) => base44.entities.PostProduction.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['postProduction'] });
      closeForm();
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => base44.entities.PostProduction.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['postProduction'] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => base44.entities.PostProduction.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['postProduction'] });
    },
  });

  const createVersionMutation = useMutation({
    mutationFn: (data) => base44.entities.PostVersion.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['postVersions'] });
      setShowVersionDialog(false);
      setVersionData({ video_link: '', feedback: '' });
    },
  });

  const closeForm = () => {
    setShowForm(false);
    setFormData({
      project_id: '',
      editor_id: '',
      status: 'Not Started',
      draft_version: 1,
      feedback: '',
      due_date: '',
      video_link: ''
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    createMutation.mutate(formData);
  };

  const handleFileUpload = async (e, isVersion = false) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingFile(true);
    try {
      const { file_url } = await base44.integrations.Core.UploadFile({ file });
      if (isVersion) {
        setVersionData(prev => ({ ...prev, video_link: file_url }));
      } else {
        setFormData(prev => ({ ...prev, video_link: file_url }));
      }
    } catch (error) {
      console.error('File upload failed:', error);
    } finally {
      setUploadingFile(false);
    }
  };

  const handleStatusChange = (post, newStatus) => {
    updateMutation.mutate({ 
      id: post.id, 
      data: { ...post, status: newStatus } 
    });
  };

  const handleAddVersion = () => {
    if (!selectedPost) return;
    const newVersion = selectedPost.draft_version + 1;
    
    createVersionMutation.mutate({
      post_production_id: selectedPost.id,
      project_id: selectedPost.project_id,
      version_number: newVersion,
      video_link: versionData.video_link,
      feedback: versionData.feedback,
      status: selectedPost.status
    });

    updateMutation.mutate({
      id: selectedPost.id,
      data: { ...selectedPost, draft_version: newVersion }
    });
  };

  const projectMap = projects.reduce((acc, p) => ({ ...acc, [p.id]: p }), {});
  const crewMap = crew.reduce((acc, c) => ({ ...acc, [c.id]: c }), {});
  const editors = crew.filter(c => c.role === 'Editor');

  const getVersionsForPost = (postId) => {
    return versions.filter(v => v.post_production_id === postId);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-white">Post-Productie</h1>
          <p className="text-gray-500 mt-1">{posts.length} projecten in post</p>
        </div>
        <Button onClick={() => setShowForm(true)} className="bg-emerald-500 hover:bg-emerald-600 gap-2">
          <Plus className="w-4 h-4" />
          Nieuwe Post-Productie
        </Button>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {[1, 2, 3, 4].map(i => (
            <Skeleton key={i} className="h-96 bg-[#22262b]" />
          ))}
        </div>
      ) : posts.length === 0 ? (
        <div className="bg-[#22262b] rounded-2xl p-12 text-center border border-gray-800/50">
          <Video className="w-12 h-12 text-gray-600 mx-auto mb-4" />
          <p className="text-gray-400 mb-4">Nog geen post-productie gestart</p>
          <Button onClick={() => setShowForm(true)} className="bg-emerald-500 hover:bg-emerald-600">
            Start eerste project
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {posts.map(post => {
            const postVersions = getVersionsForPost(post.id);
            const currentIdx = POST_STATUSES.indexOf(post.status);
            
            return (
              <div key={post.id} className="bg-[#22262b] rounded-2xl p-6 border border-gray-800/50">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-white mb-1">
                      {projectMap[post.project_id]?.title || 'Unknown Project'}
                    </h3>
                    <div className="flex items-center gap-2">
                      <Badge className={statusColors[post.status]} variant="outline">
                        {post.status}
                      </Badge>
                      <Badge variant="outline" className="border-gray-600 text-gray-400">
                        v{post.draft_version}
                      </Badge>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => deleteMutation.mutate(post.id)}
                    className="text-gray-400 hover:text-red-400 h-8 w-8"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>

                {/* Status Timeline */}
                <div className="mb-4">
                  <p className="text-xs text-gray-500 mb-2">Progress</p>
                  <div className="flex gap-1">
                    {POST_STATUSES.map((status, idx) => (
                      <div
                        key={status}
                        className={`flex-1 h-2 rounded-full transition-all ${
                          idx <= currentIdx 
                            ? 'bg-emerald-500' 
                            : 'bg-gray-700'
                        }`}
                        title={status}
                      />
                    ))}
                  </div>
                  <div className="flex justify-between mt-1">
                    <span className="text-xs text-gray-600">Start</span>
                    <span className="text-xs text-gray-600">Afgerond</span>
                  </div>
                </div>

                {/* Editor */}
                <div className="mb-4">
                  <Label className="text-gray-400 text-xs mb-1">Editor</Label>
                  <Select 
                    value={post.editor_id || ''} 
                    onValueChange={(v) => updateMutation.mutate({ 
                      id: post.id, 
                      data: { ...post, editor_id: v } 
                    })}
                  >
                    <SelectTrigger className="bg-[#1a1d21] border-gray-700 h-9">
                      <SelectValue placeholder="Selecteer editor" />
                    </SelectTrigger>
                    <SelectContent>
                      {editors.map(e => (
                        <SelectItem key={e.id} value={e.id}>{e.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Status Selector */}
                <div className="mb-4">
                  <Label className="text-gray-400 text-xs mb-1">Status</Label>
                  <Select 
                    value={post.status} 
                    onValueChange={(v) => handleStatusChange(post, v)}
                  >
                    <SelectTrigger className="bg-[#1a1d21] border-gray-700 h-9">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {POST_STATUSES.map(s => (
                        <SelectItem key={s} value={s}>{s}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Dates */}
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div>
                    <Label className="text-gray-400 text-xs mb-1">Deadline</Label>
                    <Input
                      type="date"
                      value={post.due_date || ''}
                      onChange={(e) => updateMutation.mutate({ 
                        id: post.id, 
                        data: { ...post, due_date: e.target.value } 
                      })}
                      className="bg-[#1a1d21] border-gray-700 h-9 text-sm"
                    />
                  </div>
                  <div>
                    <Label className="text-gray-400 text-xs mb-1">Opgeleverd</Label>
                    <Input
                      type="date"
                      value={post.delivered_date || ''}
                      onChange={(e) => updateMutation.mutate({ 
                        id: post.id, 
                        data: { ...post, delivered_date: e.target.value } 
                      })}
                      className="bg-[#1a1d21] border-gray-700 h-9 text-sm"
                    />
                  </div>
                </div>

                {/* Video Link */}
                {post.video_link && (
                  <div className="mb-4">
                    <a 
                      href={post.video_link} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-sm text-emerald-400 hover:text-emerald-300"
                    >
                      <Video className="w-4 h-4" />
                      Bekijk huidige versie
                    </a>
                  </div>
                )}

                {/* Feedback */}
                {post.feedback && (
                  <div className="mb-4 p-3 bg-[#1a1d21] rounded-lg">
                    <p className="text-xs text-gray-500 mb-1">Laatste Feedback</p>
                    <p className="text-sm text-gray-300">{post.feedback}</p>
                  </div>
                )}

                {/* Version History */}
                {postVersions.length > 0 && (
                  <div className="mb-4">
                    <p className="text-xs text-gray-500 mb-2">Versie Historie ({postVersions.length})</p>
                    <div className="space-y-2 max-h-32 overflow-y-auto">
                      {postVersions.map(v => (
                        <div key={v.id} className="p-2 bg-[#1a1d21] rounded text-xs">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-white font-medium">v{v.version_number}</span>
                            <span className="text-gray-500">
                              {format(new Date(v.created_date), 'd MMM', { locale: nl })}
                            </span>
                          </div>
                          {v.video_link && (
                            <a 
                              href={v.video_link} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-emerald-400 hover:underline"
                            >
                              Video bekijken
                            </a>
                          )}
                          {v.feedback && (
                            <p className="text-gray-500 mt-1">{v.feedback}</p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Actions */}
                <Button
                  onClick={() => {
                    setSelectedPost(post);
                    setShowVersionDialog(true);
                  }}
                  variant="outline"
                  size="sm"
                  className="w-full border-gray-600 text-gray-300"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Nieuwe Versie Toevoegen
                </Button>
              </div>
            );
          })}
        </div>
      )}

      {/* Create Form */}
      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="bg-[#22262b] border-gray-700 text-white max-w-lg">
          <DialogHeader>
            <DialogTitle>Nieuwe Post-Productie</DialogTitle>
          </DialogHeader>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label>Project *</Label>
              <Select 
                value={formData.project_id} 
                onValueChange={(v) => setFormData(prev => ({ ...prev, project_id: v }))}
                required
              >
                <SelectTrigger className="bg-[#1a1d21] border-gray-700">
                  <SelectValue placeholder="Selecteer project" />
                </SelectTrigger>
                <SelectContent>
                  {projects.map(p => (
                    <SelectItem key={p.id} value={p.id}>{p.title}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Editor</Label>
              <Select 
                value={formData.editor_id} 
                onValueChange={(v) => setFormData(prev => ({ ...prev, editor_id: v }))}
              >
                <SelectTrigger className="bg-[#1a1d21] border-gray-700">
                  <SelectValue placeholder="Selecteer editor" />
                </SelectTrigger>
                <SelectContent>
                  {editors.map(e => (
                    <SelectItem key={e.id} value={e.id}>{e.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Status</Label>
              <Select 
                value={formData.status} 
                onValueChange={(v) => setFormData(prev => ({ ...prev, status: v }))}
              >
                <SelectTrigger className="bg-[#1a1d21] border-gray-700">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {POST_STATUSES.map(s => (
                    <SelectItem key={s} value={s}>{s}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Deadline</Label>
              <Input
                type="date"
                value={formData.due_date}
                onChange={(e) => setFormData(prev => ({ ...prev, due_date: e.target.value }))}
                className="bg-[#1a1d21] border-gray-700"
              />
            </div>

            <div className="space-y-2">
              <Label>Video Link / File</Label>
              <Input
                value={formData.video_link}
                onChange={(e) => setFormData(prev => ({ ...prev, video_link: e.target.value }))}
                className="bg-[#1a1d21] border-gray-700"
                placeholder="https://..."
              />
              <div className="text-center text-xs text-gray-500 my-2">of</div>
              <div className="border-2 border-dashed border-gray-700 rounded-lg p-4 text-center">
                <input
                  type="file"
                  id="file-upload-create"
                  accept="video/*"
                  onChange={(e) => handleFileUpload(e, false)}
                  className="hidden"
                />
                <label htmlFor="file-upload-create" className="cursor-pointer">
                  <Upload className="w-6 h-6 text-gray-500 mx-auto mb-1" />
                  <p className="text-xs text-gray-400">
                    {uploadingFile ? 'Uploading...' : 'Upload video'}
                  </p>
                </label>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Feedback</Label>
              <Textarea
                value={formData.feedback}
                onChange={(e) => setFormData(prev => ({ ...prev, feedback: e.target.value }))}
                className="bg-[#1a1d21] border-gray-700"
                placeholder="Feedback notities..."
              />
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <Button type="button" variant="outline" onClick={closeForm} className="border-gray-600 text-gray-300">
                Annuleren
              </Button>
              <Button type="submit" className="bg-emerald-500 hover:bg-emerald-600">
                Aanmaken
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Add Version Dialog */}
      <Dialog open={showVersionDialog} onOpenChange={setShowVersionDialog}>
        <DialogContent className="bg-[#22262b] border-gray-700 text-white max-w-lg">
          <DialogHeader>
            <DialogTitle>Nieuwe Versie Toevoegen</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            {selectedPost && (
              <div className="p-3 bg-[#1a1d21] rounded-lg">
                <p className="text-sm text-gray-400">
                  Nieuwe versie voor <span className="text-white font-medium">{projectMap[selectedPost.project_id]?.title}</span>
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Huidige versie: v{selectedPost.draft_version} → Nieuwe versie: v{selectedPost.draft_version + 1}
                </p>
              </div>
            )}

            <div className="space-y-2">
              <Label>Video Link / File</Label>
              <Input
                value={versionData.video_link}
                onChange={(e) => setVersionData(prev => ({ ...prev, video_link: e.target.value }))}
                className="bg-[#1a1d21] border-gray-700"
                placeholder="https://..."
              />
              <div className="text-center text-xs text-gray-500 my-2">of</div>
              <div className="border-2 border-dashed border-gray-700 rounded-lg p-4 text-center">
                <input
                  type="file"
                  id="file-upload-version"
                  accept="video/*"
                  onChange={(e) => handleFileUpload(e, true)}
                  className="hidden"
                />
                <label htmlFor="file-upload-version" className="cursor-pointer">
                  <Upload className="w-6 h-6 text-gray-500 mx-auto mb-1" />
                  <p className="text-xs text-gray-400">
                    {uploadingFile ? 'Uploading...' : 'Upload video'}
                  </p>
                </label>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Feedback</Label>
              <Textarea
                value={versionData.feedback}
                onChange={(e) => setVersionData(prev => ({ ...prev, feedback: e.target.value }))}
                className="bg-[#1a1d21] border-gray-700"
                placeholder="Feedback voor deze versie..."
              />
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => {
                  setShowVersionDialog(false);
                  setVersionData({ video_link: '', feedback: '' });
                }}
                className="border-gray-600 text-gray-300"
              >
                Annuleren
              </Button>
              <Button 
                onClick={handleAddVersion}
                disabled={!versionData.video_link}
                className="bg-emerald-500 hover:bg-emerald-600"
              >
                Versie Toevoegen
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}