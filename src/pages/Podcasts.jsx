import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { PodcastEpisode, Business } from '@/api/entities';
import { Plus, Mic, Calendar, TrendingUp, Filter, Search, Grid3X3, List } from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '../utils';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { format, startOfWeek, endOfWeek, isWithinInterval, startOfMonth, endOfMonth } from 'date-fns';
import { nl } from 'date-fns/locale';

const STATUSES = ['Idea', 'Research', 'Guest Confirmed', 'Pre-Production', 'Recording Scheduled', 'Recorded', 'Rough Edit', 'Final Edit', 'Ready to Publish', 'Published', 'Archived'];

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

const platformIcons = {
  'Spotify': '🟢',
  'Apple Podcasts': '🟣',
  'YouTube': '▶️',
  'Google Podcasts': '🔵',
};

export default function Podcasts() {
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [viewMode, setViewMode] = useState('grid');
  const [filters, setFilters] = useState({ business: 'all', status: 'all', search: '' });
  const [formData, setFormData] = useState({
    episode_number: '',
    title: '',
    business_id: '',
    guest_name: '',
    guest_email: '',
    recording_date: '',
    recording_time: '',
    description: '',
    key_topics: [],
    status: 'Idea'
  });

  const { data: episodes = [], isLoading } = useQuery({
    queryKey: ['podcastEpisodes'],
    queryFn: () => PodcastEpisode.list('-episode_number'),
  });

  const { data: businesses = [] } = useQuery({
    queryKey: ['businesses'],
    queryFn: () => Business.list(),
  });

  const createMutation = useMutation({
    mutationFn: (data) => PodcastEpisode.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['podcastEpisodes'] });
      setShowForm(false);
      resetForm();
    },
  });

  const resetForm = () => {
    setFormData({
      episode_number: '',
      title: '',
      business_id: '',
      guest_name: '',
      guest_email: '',
      recording_date: '',
      recording_time: '',
      description: '',
      key_topics: [],
      status: 'Idea'
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    createMutation.mutate(formData);
  };

  // Calculate metrics
  const weekStart = startOfWeek(new Date(), { weekStartsOn: 1 });
  const weekEnd = endOfWeek(new Date(), { weekStartsOn: 1 });
  const monthStart = startOfMonth(new Date());
  const monthEnd = endOfMonth(new Date());

  const recordingThisWeek = episodes.filter(e => {
    if (!e.recording_date) return false;
    const date = new Date(e.recording_date);
    return isWithinInterval(date, { start: weekStart, end: weekEnd });
  }).length;

  const inProduction = episodes.filter(e => 
    ['Recorded', 'Rough Edit', 'Final Edit'].includes(e.status)
  ).length;

  const publishedThisMonth = episodes.filter(e => {
    if (!e.publish_date) return false;
    const date = new Date(e.publish_date);
    return isWithinInterval(date, { start: monthStart, end: monthEnd });
  }).length;

  const businessMap = businesses.reduce((acc, b) => ({ ...acc, [b.id]: b }), {});

  const filteredEpisodes = episodes.filter(e => {
    if (filters.business !== 'all' && e.business_id !== filters.business) return false;
    if (filters.status !== 'all' && e.status !== filters.status) return false;
    if (filters.search && !e.title.toLowerCase().includes(filters.search.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-white">Podcast Productie</h1>
          <p className="text-gray-500 mt-1">{episodes.length} afleveringen totaal</p>
        </div>
        <Button 
          onClick={() => setShowForm(true)}
          className="bg-emerald-500 hover:bg-emerald-600 gap-2"
        >
          <Plus className="w-4 h-4" />
          Nieuwe Aflevering
        </Button>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[#22262b] rounded-xl p-6 border border-gray-800/50">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-lg bg-emerald-500/20 flex items-center justify-center">
              <Mic className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{episodes.length}</p>
              <p className="text-sm text-gray-500">Totaal Afleveringen</p>
            </div>
          </div>
        </div>

        <div className="bg-[#22262b] rounded-xl p-6 border border-gray-800/50">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
              <Calendar className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{recordingThisWeek}</p>
              <p className="text-sm text-gray-500">Opnames Deze Week</p>
            </div>
          </div>
        </div>

        <div className="bg-[#22262b] rounded-xl p-6 border border-gray-800/50">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-purple-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{inProduction}</p>
              <p className="text-sm text-gray-500">In Productie</p>
            </div>
          </div>
        </div>

        <div className="bg-[#22262b] rounded-xl p-6 border border-gray-800/50">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-lg bg-green-500/20 flex items-center justify-center">
              <span className="text-xl">📢</span>
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{publishedThisMonth}</p>
              <p className="text-sm text-gray-500">Gepubliceerd Deze Maand</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-[#22262b] rounded-2xl p-4 border border-gray-800/50">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <Input
              placeholder="Zoek afleveringen..."
              value={filters.search}
              onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
              className="pl-10 bg-[#1a1d21] border-gray-700 text-white"
            />
          </div>
          
          <div className="flex flex-wrap gap-3">
            <Select value={filters.business} onValueChange={(v) => setFilters(prev => ({ ...prev, business: v }))}>
              <SelectTrigger className="w-40 bg-[#1a1d21] border-gray-700 text-white">
                <SelectValue placeholder="Organisatie" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Alle Organisaties</SelectItem>
                {businesses.map(b => (
                  <SelectItem key={b.id} value={b.id}>{b.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={filters.status} onValueChange={(v) => setFilters(prev => ({ ...prev, status: v }))}>
              <SelectTrigger className="w-40 bg-[#1a1d21] border-gray-700 text-white">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Alle Statussen</SelectItem>
                {STATUSES.map(s => (
                  <SelectItem key={s} value={s}>{s}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <div className="flex border border-gray-700 rounded-lg overflow-hidden">
              <Button
                variant={viewMode === 'grid' ? 'secondary' : 'ghost'}
                size="icon"
                onClick={() => setViewMode('grid')}
                className={viewMode === 'grid' ? 'bg-emerald-500/20 text-emerald-400' : 'text-gray-400'}
              >
                <Grid3X3 className="w-4 h-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'secondary' : 'ghost'}
                size="icon"
                onClick={() => setViewMode('list')}
                className={viewMode === 'list' ? 'bg-emerald-500/20 text-emerald-400' : 'text-gray-400'}
              >
                <List className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Episodes Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <Skeleton key={i} className="h-64 bg-[#22262b]" />
          ))}
        </div>
      ) : filteredEpisodes.length === 0 ? (
        <div className="bg-[#22262b] rounded-2xl p-12 text-center border border-gray-800/50">
          <Mic className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <p className="text-gray-400 mb-4">Nog geen podcast afleveringen</p>
          <Button onClick={() => setShowForm(true)} className="bg-emerald-500 hover:bg-emerald-600">
            Maak je eerste aflevering
          </Button>
        </div>
      ) : (
        <div className={viewMode === 'grid' 
          ? "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4"
          : "space-y-3"
        }>
          {filteredEpisodes.map(episode => (
            <Link key={episode.id} to={createPageUrl(`PodcastDetail?id=${episode.id}`)}>
              <div className="bg-[#22262b] rounded-xl border border-gray-800/50 hover:border-gray-700 transition-all overflow-hidden">
                {/* Artwork */}
                <div className="aspect-square bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center relative">
                  {episode.episode_artwork ? (
                    <img src={episode.episode_artwork} alt={episode.title} className="w-full h-full object-cover" />
                  ) : (
                    <div className="text-6xl">🎙️</div>
                  )}
                  <div className="absolute top-3 left-3">
                    <div className="bg-black/70 rounded-lg px-3 py-1">
                      <span className="text-white font-bold text-sm">EP. {episode.episode_number}</span>
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="p-4 space-y-3">
                  <div>
                    <h3 className="font-semibold text-white mb-1 line-clamp-2">{episode.title}</h3>
                    {episode.guest_name && (
                      <p className="text-sm text-gray-400 flex items-center gap-1">
                        🎤 {episode.guest_name}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    {episode.recording_date && (
                      <>
                        <span>📅 {format(new Date(episode.recording_date), 'd MMM yyyy', { locale: nl })}</span>
                      </>
                    )}
                    {episode.estimated_duration && (
                      <>
                        <span>•</span>
                        <span>⏱️ {episode.estimated_duration}</span>
                      </>
                    )}
                  </div>

                  <Badge variant="outline" className={statusColors[episode.status]}>
                    {episode.status}
                  </Badge>

                  {episode.publishing_platforms?.length > 0 && (
                    <div className="flex gap-2">
                      {episode.publishing_platforms.slice(0, 4).map((platform, idx) => (
                        <span key={idx} className="text-lg" title={platform}>
                          {platformIcons[platform] || '📡'}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* New Episode Dialog */}
      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="bg-[#22262b] border-gray-700 text-white max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Nieuwe Podcast Aflevering</DialogTitle>
          </DialogHeader>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Episode Nummer *</Label>
                <Input
                  type="number"
                  value={formData.episode_number}
                  onChange={(e) => setFormData(prev => ({ ...prev, episode_number: e.target.value }))}
                  className="bg-[#1a1d21] border-gray-700"
                  placeholder="1"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>Organisatie *</Label>
                <Select 
                  value={formData.business_id} 
                  onValueChange={(v) => setFormData(prev => ({ ...prev, business_id: v }))}
                >
                  <SelectTrigger className="bg-[#1a1d21] border-gray-700">
                    <SelectValue placeholder="Selecteer" />
                  </SelectTrigger>
                  <SelectContent>
                    {businesses.map(b => (
                      <SelectItem key={b.id} value={b.id}>{b.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Episode Titel *</Label>
              <Input
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                className="bg-[#1a1d21] border-gray-700"
                placeholder="Bijv. Interview met John Doe"
                required
              />
            </div>

            <div className="space-y-2">
              <Label>Gast Naam</Label>
              <Input
                value={formData.guest_name}
                onChange={(e) => setFormData(prev => ({ ...prev, guest_name: e.target.value }))}
                className="bg-[#1a1d21] border-gray-700"
                placeholder="John Doe"
              />
            </div>

            <div className="space-y-2">
              <Label>Gast Email</Label>
              <Input
                type="email"
                value={formData.guest_email}
                onChange={(e) => setFormData(prev => ({ ...prev, guest_email: e.target.value }))}
                className="bg-[#1a1d21] border-gray-700"
                placeholder="john@example.com"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Opname Datum</Label>
                <Input
                  type="date"
                  value={formData.recording_date}
                  onChange={(e) => setFormData(prev => ({ ...prev, recording_date: e.target.value }))}
                  className="bg-[#1a1d21] border-gray-700"
                />
              </div>
              <div className="space-y-2">
                <Label>Opname Tijd</Label>
                <Input
                  type="time"
                  value={formData.recording_time}
                  onChange={(e) => setFormData(prev => ({ ...prev, recording_time: e.target.value }))}
                  className="bg-[#1a1d21] border-gray-700"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Beschrijving</Label>
              <Textarea
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                className="bg-[#1a1d21] border-gray-700"
                placeholder="Episode beschrijving..."
              />
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <Button type="button" variant="outline" onClick={() => setShowForm(false)} className="border-gray-600 text-gray-300">
                Annuleren
              </Button>
              <Button type="submit" className="bg-emerald-500 hover:bg-emerald-600">
                Aflevering Aanmaken
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}