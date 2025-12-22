import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { ArrowLeft, Edit2, Save, Upload, Plus, Trash2, CheckSquare, FileAudio } from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '../utils';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { format } from 'date-fns';
import { nl } from 'date-fns/locale';

const STATUSES = ['Idea', 'Research', 'Guest Confirmed', 'Pre-Production', 'Recording Scheduled', 'Recorded', 'Rough Edit', 'Final Edit', 'Ready to Publish', 'Published', 'Archived'];
const RECORDING_LOCATIONS = ['Studio', 'Remote', 'Hybrid', 'On Location'];
const PRIORITIES = ['Low', 'Medium', 'High', 'Urgent'];
const PLATFORMS = ['Spotify', 'Apple Podcasts', 'Google Podcasts', 'YouTube', 'Website', 'RSS Feed', 'Other'];
const CHECKLIST_CATEGORIES = ['Guest Prep', 'Equipment', 'Research', 'Location', 'Technical', 'Marketing', 'Other'];

const statusColors = {
  'Idea': 'bg-gray-500/20 text-gray-400 border-gray-500/30',
  'Research': 'bg-blue-300/20 text-blue-300 border-blue-300/30',
  'Guest Confirmed': 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  'Pre-Production': 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
  'Recording Scheduled': 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  'Recorded': 'bg-orange-500/20 text-orange-400 border-orange-500/30',
  'Rough Edit': 'bg-purple-500/20 text-purple-400 border-purple-500/30',
  'Final Edit': 'bg-violet-500/20 text-violet-400 border-violet-500/30',
  'Ready to Publish': 'bg-lime-500/20 text-lime-400 border-lime-500/30',
  'Published': 'bg-green-500/20 text-green-400 border-green-500/30',
  'Archived': 'bg-gray-600/20 text-gray-500 border-gray-600/30',
};

export default function PodcastDetail() {
  const queryClient = useQueryClient();
  const urlParams = new URLSearchParams(window.location.search);
  const episodeId = urlParams.get('id');
  
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState(null);
  const [newChecklistItem, setNewChecklistItem] = useState('');
  const [newChecklistCategory, setNewChecklistCategory] = useState('Other');

  const { data: episode, isLoading } = useQuery({
    queryKey: ['podcastEpisode', episodeId],
    queryFn: async () => {
      const episodes = await base44.entities.PodcastEpisode.filter({ id: episodeId });
      return episodes[0];
    },
    enabled: !!episodeId,
  });

  const { data: businesses = [] } = useQuery({
    queryKey: ['businesses'],
    queryFn: () => base44.entities.Business.list(),
  });

  const { data: crew = [] } = useQuery({
    queryKey: ['crew'],
    queryFn: () => base44.entities.CrewMember.list(),
  });

  const { data: checklist = [] } = useQuery({
    queryKey: ['podcastChecklist', episodeId],
    queryFn: () => base44.entities.PodcastChecklist.filter({ episode_id: episodeId }),
    enabled: !!episodeId,
  });

  const updateMutation = useMutation({
    mutationFn: (data) => base44.entities.PodcastEpisode.update(episodeId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['podcastEpisode', episodeId] });
      setIsEditing(false);
    },
  });

  const addChecklistMutation = useMutation({
    mutationFn: (data) => base44.entities.PodcastChecklist.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['podcastChecklist', episodeId] });
      setNewChecklistItem('');
    },
  });

  const updateChecklistMutation = useMutation({
    mutationFn: ({ id, data }) => base44.entities.PodcastChecklist.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['podcastChecklist', episodeId] });
    },
  });

  const deleteChecklistMutation = useMutation({
    mutationFn: (id) => base44.entities.PodcastChecklist.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['podcastChecklist', episodeId] });
    },
  });

  const handleFileUpload = async (fieldName) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = fieldName.includes('artwork') || fieldName.includes('image') ? 'image/*' : '*/*';
    input.onchange = async (e) => {
      const file = e.target.files[0];
      if (file) {
        const { file_url } = await base44.integrations.Core.UploadFile({ file });
        updateMutation.mutate({ [fieldName]: file_url });
      }
    };
    input.click();
  };

  const businessMap = businesses.reduce((acc, b) => ({ ...acc, [b.id]: b }), {});
  const crewMap = crew.reduce((acc, c) => ({ ...acc, [c.id]: c }), {});

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-12 w-64 bg-[#22262b]" />
        <Skeleton className="h-96 bg-[#22262b]" />
      </div>
    );
  }

  if (!episode) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-400">Aflevering niet gevonden</p>
        <Link to={createPageUrl('Podcasts')}>
          <Button className="mt-4">Terug naar afleveringen</Button>
        </Link>
      </div>
    );
  }

  const startEditing = () => {
    setEditData({ ...episode });
    setIsEditing(true);
  };

  const saveChanges = () => {
    updateMutation.mutate(editData);
  };

  const handleAddChecklistItem = () => {
    if (!newChecklistItem.trim()) return;
    addChecklistMutation.mutate({
      episode_id: episodeId,
      item: newChecklistItem,
      category: newChecklistCategory
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link to={createPageUrl('Podcasts')}>
            <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <div>
            <div className="flex items-center gap-3">
              <span className="text-emerald-400 font-bold">EP. {episode.episode_number}</span>
              <h1 className="text-2xl lg:text-3xl font-bold text-white">{episode.title}</h1>
              <Badge variant="outline" className={statusColors[episode.status]}>
                {episode.status}
              </Badge>
            </div>
            <p className="text-gray-500 mt-1">{businessMap[episode.business_id]?.name}</p>
          </div>
        </div>
        
        {isEditing ? (
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setIsEditing(false)} className="border-gray-600 text-gray-300">
              Annuleren
            </Button>
            <Button onClick={saveChanges} className="bg-emerald-500 hover:bg-emerald-600 gap-2">
              <Save className="w-4 h-4" />
              Opslaan
            </Button>
          </div>
        ) : (
          <Button onClick={startEditing} variant="outline" className="border-gray-600 text-gray-300 gap-2">
            <Edit2 className="w-4 h-4" />
            Bewerken
          </Button>
        )}
      </div>

      {/* Tabs */}
      <Tabs defaultValue="info" className="space-y-6">
        <TabsList className="bg-[#22262b] border border-gray-800">
          <TabsTrigger value="info" className="data-[state=active]:bg-emerald-500/20 data-[state=active]:text-emerald-400">
            Info
          </TabsTrigger>
          <TabsTrigger value="prep" className="data-[state=active]:bg-emerald-500/20 data-[state=active]:text-emerald-400">
            Pre-Productie
          </TabsTrigger>
          <TabsTrigger value="recording" className="data-[state=active]:bg-emerald-500/20 data-[state=active]:text-emerald-400">
            Opname
          </TabsTrigger>
          <TabsTrigger value="edit" className="data-[state=active]:bg-emerald-500/20 data-[state=active]:text-emerald-400">
            Montage
          </TabsTrigger>
          <TabsTrigger value="publish" className="data-[state=active]:bg-emerald-500/20 data-[state=active]:text-emerald-400">
            Publicatie
          </TabsTrigger>
        </TabsList>

        {/* Episode Info Tab */}
        <TabsContent value="info" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left: Artwork */}
            <div className="bg-[#22262b] rounded-2xl p-6 border border-gray-800/50">
              <h3 className="font-semibold text-white mb-4">Episode Artwork</h3>
              <div className="aspect-square bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-lg flex items-center justify-center mb-4">
                {episode.episode_artwork ? (
                  <img src={episode.episode_artwork} alt="Artwork" className="w-full h-full object-cover rounded-lg" />
                ) : (
                  <div className="text-6xl">🎙️</div>
                )}
              </div>
              <Button 
                onClick={() => handleFileUpload('episode_artwork')}
                variant="outline" 
                className="w-full border-gray-700 text-gray-300 gap-2"
              >
                <Upload className="w-4 h-4" />
                Upload Artwork
              </Button>
            </div>

            {/* Middle: Basic Info */}
            <div className="bg-[#22262b] rounded-2xl p-6 border border-gray-800/50 space-y-4">
              <h3 className="font-semibold text-white mb-4">Basis Informatie</h3>
              
              {isEditing ? (
                <>
                  <div className="space-y-2">
                    <Label>Episode Nummer</Label>
                    <Input
                      type="number"
                      value={editData.episode_number}
                      onChange={(e) => setEditData(prev => ({ ...prev, episode_number: e.target.value }))}
                      className="bg-[#1a1d21] border-gray-700"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Titel</Label>
                    <Input
                      value={editData.title}
                      onChange={(e) => setEditData(prev => ({ ...prev, title: e.target.value }))}
                      className="bg-[#1a1d21] border-gray-700"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Status</Label>
                    <Select 
                      value={editData.status} 
                      onValueChange={(v) => setEditData(prev => ({ ...prev, status: v }))}
                    >
                      <SelectTrigger className="bg-[#1a1d21] border-gray-700">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {STATUSES.map(s => (
                          <SelectItem key={s} value={s}>{s}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Prioriteit</Label>
                    <Select 
                      value={editData.priority} 
                      onValueChange={(v) => setEditData(prev => ({ ...prev, priority: v }))}
                    >
                      <SelectTrigger className="bg-[#1a1d21] border-gray-700">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {PRIORITIES.map(p => (
                          <SelectItem key={p} value={p}>{p}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <p className="text-sm text-gray-500">Episode Nummer</p>
                    <p className="font-medium text-white">{episode.episode_number}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Prioriteit</p>
                    <p className="font-medium text-white">{episode.priority || '-'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Geschatte Duur</p>
                    <p className="font-medium text-white">{episode.estimated_duration || '-'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Werkelijke Duur</p>
                    <p className="font-medium text-white">{episode.actual_duration || '-'}</p>
                  </div>
                </>
              )}
            </div>

            {/* Right: Guest Info */}
            <div className="bg-[#22262b] rounded-2xl p-6 border border-gray-800/50 space-y-4">
              <h3 className="font-semibold text-white mb-4">Gast Informatie</h3>
              
              {isEditing ? (
                <>
                  <div className="space-y-2">
                    <Label>Gast Naam</Label>
                    <Input
                      value={editData.guest_name || ''}
                      onChange={(e) => setEditData(prev => ({ ...prev, guest_name: e.target.value }))}
                      className="bg-[#1a1d21] border-gray-700"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Email</Label>
                    <Input
                      type="email"
                      value={editData.guest_email || ''}
                      onChange={(e) => setEditData(prev => ({ ...prev, guest_email: e.target.value }))}
                      className="bg-[#1a1d21] border-gray-700"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Telefoon</Label>
                    <Input
                      value={editData.guest_phone || ''}
                      onChange={(e) => setEditData(prev => ({ ...prev, guest_phone: e.target.value }))}
                      className="bg-[#1a1d21] border-gray-700"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Bio</Label>
                    <Textarea
                      value={editData.guest_bio || ''}
                      onChange={(e) => setEditData(prev => ({ ...prev, guest_bio: e.target.value }))}
                      className="bg-[#1a1d21] border-gray-700 min-h-[100px]"
                    />
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <p className="text-sm text-gray-500">Naam</p>
                    <p className="font-medium text-white">{episode.guest_name || '-'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <p className="font-medium text-white">{episode.guest_email || '-'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Telefoon</p>
                    <p className="font-medium text-white">{episode.guest_phone || '-'}</p>
                  </div>
                  {episode.guest_bio && (
                    <div>
                      <p className="text-sm text-gray-500 mb-2">Bio</p>
                      <p className="text-sm text-gray-300">{episode.guest_bio}</p>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>

          {/* Description & Show Notes */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-[#22262b] rounded-2xl p-6 border border-gray-800/50">
              <h3 className="font-semibold text-white mb-4">Beschrijving</h3>
              {isEditing ? (
                <Textarea
                  value={editData.description || ''}
                  onChange={(e) => setEditData(prev => ({ ...prev, description: e.target.value }))}
                  className="bg-[#1a1d21] border-gray-700 min-h-[150px]"
                  placeholder="Episode beschrijving..."
                />
              ) : (
                <p className="text-gray-300 text-sm whitespace-pre-wrap">{episode.description || 'Geen beschrijving'}</p>
              )}
            </div>

            <div className="bg-[#22262b] rounded-2xl p-6 border border-gray-800/50">
              <h3 className="font-semibold text-white mb-4">Show Notes</h3>
              {isEditing ? (
                <Textarea
                  value={editData.show_notes || ''}
                  onChange={(e) => setEditData(prev => ({ ...prev, show_notes: e.target.value }))}
                  className="bg-[#1a1d21] border-gray-700 min-h-[150px]"
                  placeholder="Show notes..."
                />
              ) : (
                <p className="text-gray-300 text-sm whitespace-pre-wrap">{episode.show_notes || 'Geen show notes'}</p>
              )}
            </div>
          </div>
        </TabsContent>

        {/* Pre-Production Tab */}
        <TabsContent value="prep" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-[#22262b] rounded-2xl p-6 border border-gray-800/50">
              <h3 className="font-semibold text-white mb-4">Vragenlijst</h3>
              <Textarea
                value={editData?.question_outline || episode.question_outline || ''}
                onChange={(e) => isEditing && setEditData(prev => ({ ...prev, question_outline: e.target.value }))}
                className="bg-[#1a1d21] border-gray-700 min-h-[200px]"
                placeholder="Interview vragen en outline..."
                readOnly={!isEditing}
              />
            </div>

            <div className="bg-[#22262b] rounded-2xl p-6 border border-gray-800/50">
              <h3 className="font-semibold text-white mb-4">Research Notities</h3>
              <Textarea
                value={editData?.research_notes || episode.research_notes || ''}
                onChange={(e) => isEditing && setEditData(prev => ({ ...prev, research_notes: e.target.value }))}
                className="bg-[#1a1d21] border-gray-700 min-h-[200px]"
                placeholder="Achtergrond onderzoek..."
                readOnly={!isEditing}
              />
            </div>
          </div>

          {/* Checklist */}
          <div className="bg-[#22262b] rounded-2xl p-6 border border-gray-800/50">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-white">Pre-Productie Checklist</h3>
              <div className="text-sm text-gray-500">
                {checklist.filter(c => c.is_completed).length} / {checklist.length} voltooid
              </div>
            </div>

            <div className="space-y-3 mb-4">
              {checklist.map(item => (
                <div key={item.id} className="flex items-center gap-3 p-3 bg-[#1a1d21] rounded-lg">
                  <Checkbox
                    checked={item.is_completed}
                    onCheckedChange={(checked) => 
                      updateChecklistMutation.mutate({ 
                        id: item.id, 
                        data: { ...item, is_completed: checked } 
                      })
                    }
                  />
                  <div className="flex-1">
                    <p className={`text-sm ${item.is_completed ? 'text-gray-500 line-through' : 'text-white'}`}>
                      {item.item}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="outline" className="border-gray-700 text-gray-500 text-xs">
                        {item.category}
                      </Badge>
                      {item.due_date && (
                        <span className="text-xs text-gray-500">
                          📅 {format(new Date(item.due_date), 'd MMM', { locale: nl })}
                        </span>
                      )}
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => deleteChecklistMutation.mutate(item.id)}
                    className="h-8 w-8 text-gray-500 hover:text-red-400"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>

            <div className="flex gap-2">
              <Select value={newChecklistCategory} onValueChange={setNewChecklistCategory}>
                <SelectTrigger className="w-40 bg-[#1a1d21] border-gray-700">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {CHECKLIST_CATEGORIES.map(c => (
                    <SelectItem key={c} value={c}>{c}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Input
                value={newChecklistItem}
                onChange={(e) => setNewChecklistItem(e.target.value)}
                placeholder="Nieuwe checklist item..."
                className="bg-[#1a1d21] border-gray-700"
                onKeyPress={(e) => e.key === 'Enter' && handleAddChecklistItem()}
              />
              <Button onClick={handleAddChecklistItem} className="bg-emerald-500 hover:bg-emerald-600">
                <Plus className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </TabsContent>

        {/* Recording Tab */}
        <TabsContent value="recording" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-[#22262b] rounded-2xl p-6 border border-gray-800/50 space-y-4">
              <h3 className="font-semibold text-white mb-4">Opname Details</h3>
              
              {isEditing ? (
                <>
                  <div className="space-y-2">
                    <Label>Opname Datum</Label>
                    <Input
                      type="date"
                      value={editData.recording_date || ''}
                      onChange={(e) => setEditData(prev => ({ ...prev, recording_date: e.target.value }))}
                      className="bg-[#1a1d21] border-gray-700"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Tijd</Label>
                    <Input
                      type="time"
                      value={editData.recording_time || ''}
                      onChange={(e) => setEditData(prev => ({ ...prev, recording_time: e.target.value }))}
                      className="bg-[#1a1d21] border-gray-700"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Locatie</Label>
                    <Select 
                      value={editData.recording_location || 'Studio'} 
                      onValueChange={(v) => setEditData(prev => ({ ...prev, recording_location: v }))}
                    >
                      <SelectTrigger className="bg-[#1a1d21] border-gray-700">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {RECORDING_LOCATIONS.map(l => (
                          <SelectItem key={l} value={l}>{l}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Geschatte Duur</Label>
                    <Input
                      value={editData.estimated_duration || ''}
                      onChange={(e) => setEditData(prev => ({ ...prev, estimated_duration: e.target.value }))}
                      className="bg-[#1a1d21] border-gray-700"
                      placeholder="45 min"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Werkelijke Duur</Label>
                    <Input
                      value={editData.actual_duration || ''}
                      onChange={(e) => setEditData(prev => ({ ...prev, actual_duration: e.target.value }))}
                      className="bg-[#1a1d21] border-gray-700"
                      placeholder="47 min"
                    />
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <p className="text-sm text-gray-500">Datum</p>
                    <p className="font-medium text-white">
                      {episode.recording_date 
                        ? format(new Date(episode.recording_date), 'd MMMM yyyy', { locale: nl }) 
                        : '-'}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Tijd</p>
                    <p className="font-medium text-white">{episode.recording_time || '-'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Locatie</p>
                    <p className="font-medium text-white">{episode.recording_location || '-'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Duur</p>
                    <p className="font-medium text-white">
                      {episode.actual_duration || episode.estimated_duration || '-'}
                    </p>
                  </div>
                </>
              )}
            </div>

            <div className="bg-[#22262b] rounded-2xl p-6 border border-gray-800/50 space-y-4">
              <h3 className="font-semibold text-white mb-4">Crew & Apparatuur</h3>
              
              {isEditing ? (
                <>
                  <div className="space-y-2">
                    <Label>Audio Engineer</Label>
                    <Select 
                      value={editData.audio_engineer_id || ''} 
                      onValueChange={(v) => setEditData(prev => ({ ...prev, audio_engineer_id: v }))}
                    >
                      <SelectTrigger className="bg-[#1a1d21] border-gray-700">
                        <SelectValue placeholder="Selecteer" />
                      </SelectTrigger>
                      <SelectContent>
                        {crew.map(c => (
                          <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Apparatuur</Label>
                    <Textarea
                      value={editData.equipment_used || ''}
                      onChange={(e) => setEditData(prev => ({ ...prev, equipment_used: e.target.value }))}
                      className="bg-[#1a1d21] border-gray-700"
                      placeholder="Microfoons, interfaces, etc..."
                    />
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <p className="text-sm text-gray-500">Audio Engineer</p>
                    <p className="font-medium text-white">
                      {crewMap[episode.audio_engineer_id]?.name || '-'}
                    </p>
                  </div>
                  {episode.equipment_used && (
                    <div>
                      <p className="text-sm text-gray-500 mb-2">Apparatuur</p>
                      <p className="text-sm text-gray-300 whitespace-pre-wrap">{episode.equipment_used}</p>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>

          <div className="bg-[#22262b] rounded-2xl p-6 border border-gray-800/50">
            <h3 className="font-semibold text-white mb-4">Technische Issues Log</h3>
            <Textarea
              value={editData?.technical_issues_log || episode.technical_issues_log || ''}
              onChange={(e) => isEditing && setEditData(prev => ({ ...prev, technical_issues_log: e.target.value }))}
              className="bg-[#1a1d21] border-gray-700 min-h-[150px]"
              placeholder="Technische problemen tijdens opname..."
              readOnly={!isEditing}
            />
          </div>
        </TabsContent>

        {/* Edit & Production Tab */}
        <TabsContent value="edit" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-[#22262b] rounded-2xl p-6 border border-gray-800/50 space-y-4">
              <h3 className="font-semibold text-white mb-4">Montage Team</h3>
              
              {isEditing ? (
                <>
                  <div className="space-y-2">
                    <Label>Editor</Label>
                    <Select 
                      value={editData.editor_id || ''} 
                      onValueChange={(v) => setEditData(prev => ({ ...prev, editor_id: v }))}
                    >
                      <SelectTrigger className="bg-[#1a1d21] border-gray-700">
                        <SelectValue placeholder="Selecteer editor" />
                      </SelectTrigger>
                      <SelectContent>
                        {crew.filter(c => c.role === 'Editor').map(c => (
                          <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Edit Versie</Label>
                    <Input
                      type="number"
                      value={editData.edit_version || 1}
                      onChange={(e) => setEditData(prev => ({ ...prev, edit_version: e.target.value }))}
                      className="bg-[#1a1d21] border-gray-700"
                    />
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <p className="text-sm text-gray-500">Editor</p>
                    <p className="font-medium text-white">
                      {crewMap[episode.editor_id]?.name || '-'}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Huidige Versie</p>
                    <p className="font-medium text-white">v{episode.edit_version || 1}</p>
                  </div>
                </>
              )}
            </div>

            <div className="bg-[#22262b] rounded-2xl p-6 border border-gray-800/50 space-y-4">
              <h3 className="font-semibold text-white mb-4">Audio Bestanden</h3>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-[#1a1d21] rounded-lg">
                  <div className="flex items-center gap-2">
                    <FileAudio className="w-4 h-4 text-gray-500" />
                    <span className="text-sm text-gray-300">Raw Audio</span>
                  </div>
                  {episode.audio_file_link ? (
                    <a href={episode.audio_file_link} target="_blank" rel="noopener noreferrer">
                      <Button size="sm" variant="outline" className="border-gray-700 text-gray-300 h-8">
                        Open
                      </Button>
                    </a>
                  ) : (
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="border-gray-700 text-gray-300 h-8"
                      onClick={() => handleFileUpload('audio_file_link')}
                    >
                      Upload
                    </Button>
                  )}
                </div>

                <div className="flex items-center justify-between p-3 bg-[#1a1d21] rounded-lg">
                  <div className="flex items-center gap-2">
                    <FileAudio className="w-4 h-4 text-gray-500" />
                    <span className="text-sm text-gray-300">Rough Cut</span>
                  </div>
                  {episode.rough_cut_link ? (
                    <a href={episode.rough_cut_link} target="_blank" rel="noopener noreferrer">
                      <Button size="sm" variant="outline" className="border-gray-700 text-gray-300 h-8">
                        Open
                      </Button>
                    </a>
                  ) : (
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="border-gray-700 text-gray-300 h-8"
                      onClick={() => handleFileUpload('rough_cut_link')}
                    >
                      Upload
                    </Button>
                  )}
                </div>

                <div className="flex items-center justify-between p-3 bg-[#1a1d21] rounded-lg">
                  <div className="flex items-center gap-2">
                    <FileAudio className="w-4 h-4 text-gray-500" />
                    <span className="text-sm text-gray-300">Final Mix</span>
                  </div>
                  {episode.final_mix_link ? (
                    <a href={episode.final_mix_link} target="_blank" rel="noopener noreferrer">
                      <Button size="sm" variant="outline" className="border-gray-700 text-gray-300 h-8">
                        Open
                      </Button>
                    </a>
                  ) : (
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="border-gray-700 text-gray-300 h-8"
                      onClick={() => handleFileUpload('final_mix_link')}
                    >
                      Upload
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-[#22262b] rounded-2xl p-6 border border-gray-800/50">
              <h3 className="font-semibold text-white mb-4">Chapter Timestamps</h3>
              <Textarea
                value={editData?.chapter_timestamps || episode.chapter_timestamps || ''}
                onChange={(e) => isEditing && setEditData(prev => ({ ...prev, chapter_timestamps: e.target.value }))}
                className="bg-[#1a1d21] border-gray-700 min-h-[200px]"
                placeholder="00:00 - Intro\n05:30 - Main topic\n25:00 - Q&A\n45:00 - Outro"
                readOnly={!isEditing}
              />
            </div>

            <div className="bg-[#22262b] rounded-2xl p-6 border border-gray-800/50">
              <h3 className="font-semibold text-white mb-4">Feedback & Notities</h3>
              <Textarea
                value={editData?.feedback_notes || episode.feedback_notes || ''}
                onChange={(e) => isEditing && setEditData(prev => ({ ...prev, feedback_notes: e.target.value }))}
                className="bg-[#1a1d21] border-gray-700 min-h-[200px]"
                placeholder="Montage feedback en revisie notities..."
                readOnly={!isEditing}
              />
            </div>
          </div>
        </TabsContent>

        {/* Publishing Tab */}
        <TabsContent value="publish" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-[#22262b] rounded-2xl p-6 border border-gray-800/50 space-y-4">
              <h3 className="font-semibold text-white mb-4">Publicatie Schema</h3>
              
              {isEditing ? (
                <>
                  <div className="space-y-2">
                    <Label>Publicatie Datum</Label>
                    <Input
                      type="date"
                      value={editData.publish_date || ''}
                      onChange={(e) => setEditData(prev => ({ ...prev, publish_date: e.target.value }))}
                      className="bg-[#1a1d21] border-gray-700"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Tijd</Label>
                    <Input
                      type="time"
                      value={editData.publish_time || ''}
                      onChange={(e) => setEditData(prev => ({ ...prev, publish_time: e.target.value }))}
                      className="bg-[#1a1d21] border-gray-700"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>SEO Beschrijving (max 160 tekens)</Label>
                    <Textarea
                      value={editData.seo_description || ''}
                      onChange={(e) => setEditData(prev => ({ ...prev, seo_description: e.target.value.substring(0, 160) }))}
                      className="bg-[#1a1d21] border-gray-700"
                      maxLength={160}
                    />
                    <p className="text-xs text-gray-500">{(editData.seo_description || '').length}/160</p>
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <p className="text-sm text-gray-500">Publicatie Datum</p>
                    <p className="font-medium text-white">
                      {episode.publish_date 
                        ? format(new Date(episode.publish_date), 'd MMMM yyyy', { locale: nl }) 
                        : '-'}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Tijd</p>
                    <p className="font-medium text-white">{episode.publish_time || '-'}</p>
                  </div>
                </>
              )}
            </div>

            <div className="bg-[#22262b] rounded-2xl p-6 border border-gray-800/50">
              <h3 className="font-semibold text-white mb-4">Platform Links</h3>
              <div className="space-y-3">
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <span>🟢</span> Spotify
                  </Label>
                  <Input
                    value={editData?.spotify_link || episode.spotify_link || ''}
                    onChange={(e) => isEditing && setEditData(prev => ({ ...prev, spotify_link: e.target.value }))}
                    className="bg-[#1a1d21] border-gray-700"
                    placeholder="https://open.spotify.com/episode/..."
                    readOnly={!isEditing}
                  />
                </div>
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <span>🟣</span> Apple Podcasts
                  </Label>
                  <Input
                    value={editData?.apple_link || episode.apple_link || ''}
                    onChange={(e) => isEditing && setEditData(prev => ({ ...prev, apple_link: e.target.value }))}
                    className="bg-[#1a1d21] border-gray-700"
                    placeholder="https://podcasts.apple.com/..."
                    readOnly={!isEditing}
                  />
                </div>
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <span>▶️</span> YouTube
                  </Label>
                  <Input
                    value={editData?.youtube_link || episode.youtube_link || ''}
                    onChange={(e) => isEditing && setEditData(prev => ({ ...prev, youtube_link: e.target.value }))}
                    className="bg-[#1a1d21] border-gray-700"
                    placeholder="https://youtube.com/watch?v=..."
                    readOnly={!isEditing}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="bg-[#22262b] rounded-2xl p-6 border border-gray-800/50">
            <h3 className="font-semibold text-white mb-4">Social Media Posts</h3>
            <Textarea
              value={editData?.social_media_posts || episode.social_media_posts || ''}
              onChange={(e) => isEditing && setEditData(prev => ({ ...prev, social_media_posts: e.target.value }))}
              className="bg-[#1a1d21] border-gray-700 min-h-[150px]"
              placeholder="Instagram, Twitter, LinkedIn posts..."
              readOnly={!isEditing}
            />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}