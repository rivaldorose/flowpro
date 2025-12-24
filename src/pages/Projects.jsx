import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Project, Business } from '@/api/entities';
import { Plus, Filter, Search, Grid3X3, List, X } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Skeleton } from "@/components/ui/skeleton";
import ProjectCard from '../components/dashboard/ProjectCard';

const PLATFORMS = ['Instagram', 'TikTok', 'YouTube', 'LinkedIn', 'Facebook', 'Website', 'Other'];
const CONTENT_TYPES = ['Video', 'Photo', 'Photo + Video', 'Reel', 'Story', 'Post'];
const STATUSES = ['Idea', 'Script Writing', 'Pre-Production', 'Production', 'Post-Production', 'Done', 'Published'];
const PRIORITIES = ['Low', 'Medium', 'High', 'Urgent'];

export default function Projects() {
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [viewMode, setViewMode] = useState('grid');
  const [selectedBusinessFilter, setSelectedBusinessFilter] = useState(() => {
    return localStorage.getItem('selectedBusiness') || 'all';
  });
  const [filters, setFilters] = useState({ business: 'all', status: 'all', search: '' });

  React.useEffect(() => {
    const handleBusinessChange = (e) => {
      setSelectedBusinessFilter(e.detail || 'all');
    };
    window.addEventListener('businessChanged', handleBusinessChange);
    return () => window.removeEventListener('businessChanged', handleBusinessChange);
  }, []);
  const [formData, setFormData] = useState({
    title: '',
    business_id: '',
    platforms: [],
    content_type: '',
    status: 'Idea',
    priority: 'Medium',
    due_date: '',
    description: ''
  });

  const { data: projects = [], isLoading } = useQuery({
    queryKey: ['projects'],
    queryFn: () => Project.list('-created_date'),
  });

  const { data: businesses = [] } = useQuery({
    queryKey: ['businesses'],
    queryFn: () => Business.list(),
  });

  const createMutation = useMutation({
    mutationFn: (data) => Project.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      setShowForm(false);
      resetForm();
    },
  });

  const resetForm = () => {
    setFormData({
      title: '',
      business_id: '',
      platforms: [],
      content_type: '',
      status: 'Idea',
      priority: 'Medium',
      due_date: '',
      description: ''
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    createMutation.mutate(formData);
  };

  const togglePlatform = (platform) => {
    setFormData(prev => ({
      ...prev,
      platforms: prev.platforms.includes(platform)
        ? prev.platforms.filter(p => p !== platform)
        : [...prev.platforms, platform]
    }));
  };

  const businessMap = businesses.reduce((acc, b) => ({ ...acc, [b.id]: b }), {});

  const filteredProjects = projects.filter(p => {
    if (selectedBusinessFilter !== 'all' && p.business_id !== selectedBusinessFilter) return false;
    if (filters.business !== 'all' && p.business_id !== filters.business) return false;
    if (filters.status !== 'all' && p.status !== filters.status) return false;
    if (filters.search && !p.title.toLowerCase().includes(filters.search.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-white">Alle Projecten</h1>
          <p className="text-gray-500 mt-1">{projects.length} projecten totaal</p>
        </div>
        <Button 
          onClick={() => setShowForm(true)}
          className="bg-emerald-500 hover:bg-emerald-600 text-white gap-2"
        >
          <Plus className="w-4 h-4" />
          Nieuw Project
        </Button>
      </div>

      {/* Filters */}
      <div className="bg-[#22262b] rounded-2xl p-4 border border-gray-800/50">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <Input
              placeholder="Zoek projecten..."
              value={filters.search}
              onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
              className="pl-10 bg-[#1a1d21] border-gray-700 text-white"
            />
          </div>
          
          <div className="flex flex-wrap gap-3">
            <Select value={filters.business} onValueChange={(v) => setFilters(prev => ({ ...prev, business: v }))}>
              <SelectTrigger className="w-40 bg-[#1a1d21] border-gray-700 text-white">
                <SelectValue placeholder="Business" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Alle Businesses</SelectItem>
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

      {/* Projects Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <Skeleton key={i} className="h-48 bg-[#22262b]" />
          ))}
        </div>
      ) : filteredProjects.length === 0 ? (
        <div className="bg-[#22262b] rounded-2xl p-12 text-center border border-gray-800/50">
          <p className="text-gray-400 mb-4">Geen projecten gevonden</p>
          <Button onClick={() => setShowForm(true)} className="bg-emerald-500 hover:bg-emerald-600">
            Maak je eerste project
          </Button>
        </div>
      ) : (
        <div className={viewMode === 'grid' 
          ? "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4"
          : "space-y-3"
        }>
          {filteredProjects.map(project => (
            <ProjectCard 
              key={project.id} 
              project={project} 
              business={businessMap[project.business_id]} 
            />
          ))}
        </div>
      )}

      {/* New Project Dialog */}
      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="bg-[#22262b] border-gray-700 text-white max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold">Nieuw Project</DialogTitle>
          </DialogHeader>
          
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label>Project Titel *</Label>
              <Input
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                className="bg-[#1a1d21] border-gray-700"
                placeholder="Bijv. Instagram Campagne Q1"
                required
              />
            </div>

            <div className="space-y-2">
              <Label>Business *</Label>
              <Select 
                value={formData.business_id} 
                onValueChange={(v) => setFormData(prev => ({ ...prev, business_id: v }))}
                required
              >
                <SelectTrigger className="bg-[#1a1d21] border-gray-700">
                  <SelectValue placeholder="Selecteer business" />
                </SelectTrigger>
                <SelectContent>
                  {businesses.map(b => (
                    <SelectItem key={b.id} value={b.id}>{b.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Platforms</Label>
              <div className="grid grid-cols-2 gap-2">
                {PLATFORMS.map(platform => (
                  <div key={platform} className="flex items-center space-x-2">
                    <Checkbox
                      id={platform}
                      checked={formData.platforms.includes(platform)}
                      onCheckedChange={() => togglePlatform(platform)}
                    />
                    <label htmlFor={platform} className="text-sm text-gray-300">{platform}</label>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Content Type</Label>
                <Select 
                  value={formData.content_type} 
                  onValueChange={(v) => setFormData(prev => ({ ...prev, content_type: v }))}
                >
                  <SelectTrigger className="bg-[#1a1d21] border-gray-700">
                    <SelectValue placeholder="Selecteer" />
                  </SelectTrigger>
                  <SelectContent>
                    {CONTENT_TYPES.map(ct => (
                      <SelectItem key={ct} value={ct}>{ct}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Prioriteit</Label>
                <Select 
                  value={formData.priority} 
                  onValueChange={(v) => setFormData(prev => ({ ...prev, priority: v }))}
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
              <Label>Beschrijving</Label>
              <Textarea
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                className="bg-[#1a1d21] border-gray-700 min-h-[80px]"
                placeholder="Project details..."
              />
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <Button type="button" variant="outline" onClick={() => setShowForm(false)} className="border-gray-600 text-gray-300">
                Annuleren
              </Button>
              <Button type="submit" className="bg-emerald-500 hover:bg-emerald-600" disabled={createMutation.isPending}>
                {createMutation.isPending ? 'Opslaan...' : 'Project Aanmaken'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}