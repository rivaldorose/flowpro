import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Script, Project } from '@/api/entities';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '../utils';
import { Plus, FileText, Edit2, Trash2, Search, Clock } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from 'date-fns';
import { nl } from 'date-fns/locale';

const STATUSES = ['Draft', 'Review', 'Approved', 'Final'];

const statusColors = {
  'Draft': 'bg-gray-500/20 text-gray-400 border-gray-500/30',
  'Review': 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  'Approved': 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
  'Final': 'bg-green-600/20 text-green-400 border-green-500/30',
};

export default function Scripts() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [filters, setFilters] = useState({ status: 'all', search: '' });
  const [formData, setFormData] = useState({
    title: '',
    project_id: '',
    content: '',
    status: 'Draft',
    version: 1
  });

  const { data: scripts = [], isLoading } = useQuery({
    queryKey: ['scripts'],
    queryFn: () => Script.list('-updated_date'),
  });

  const { data: projects = [] } = useQuery({
    queryKey: ['projects'],
    queryFn: () => Project.list(),
  });

  const createMutation = useMutation({
    mutationFn: (data) => Script.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['scripts'] });
      closeForm();
    },
  });



  const deleteMutation = useMutation({
    mutationFn: (id) => Script.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['scripts'] });
    },
  });

  const closeForm = () => {
    setShowForm(false);
    setFormData({
      title: '',
      project_id: '',
      content: '',
      status: 'Draft',
      version: 1
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    createMutation.mutate(formData);
  };

  const projectMap = projects.reduce((acc, p) => ({ ...acc, [p.id]: p }), {});

  const filteredScripts = scripts.filter(s => {
    if (filters.status !== 'all' && s.status !== filters.status) return false;
    if (filters.search && !s.title.toLowerCase().includes(filters.search.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-white">Alle Scripts</h1>
          <p className="text-gray-500 mt-1">{scripts.length} scripts</p>
        </div>
        <Button 
          onClick={() => setShowForm(true)}
          className="bg-emerald-500 hover:bg-emerald-600 text-white gap-2"
        >
          <Plus className="w-4 h-4" />
          Nieuw Script
        </Button>
      </div>

      {/* Filters */}
      <div className="bg-[#22262b] rounded-2xl p-4 border border-gray-800/50 flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <Input
            placeholder="Zoek scripts..."
            value={filters.search}
            onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
            className="pl-10 bg-[#1a1d21] border-gray-700 text-white"
          />
        </div>
        
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
      </div>

      {/* Scripts Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <Skeleton key={i} className="h-48 bg-[#22262b]" />
          ))}
        </div>
      ) : filteredScripts.length === 0 ? (
        <div className="bg-[#22262b] rounded-2xl p-12 text-center border border-gray-800/50">
          <FileText className="w-12 h-12 text-gray-600 mx-auto mb-4" />
          <p className="text-gray-400 mb-4">Geen scripts gevonden</p>
          <Button onClick={() => setShowForm(true)} className="bg-emerald-500 hover:bg-emerald-600">
            Maak je eerste script
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filteredScripts.map(script => (
            <div 
              key={script.id}
              className="bg-[#22262b] rounded-2xl p-6 border border-gray-800/50 hover:border-gray-700/50 transition-all group cursor-pointer"
              onClick={() => navigate(createPageUrl(`ScriptDetail?id=${script.id}`))}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500/20 to-red-500/20 flex items-center justify-center">
                    <FileText className="w-5 h-5 text-orange-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white">{script.title}</h3>
                    <p className="text-sm text-gray-500">{projectMap[script.project_id]?.title || 'Geen project'}</p>
                  </div>
                </div>
                
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity" onClick={(e) => e.stopPropagation()}>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => deleteMutation.mutate(script.id)}
                    className="h-8 w-8 text-gray-400 hover:text-red-400"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <div className="flex items-center gap-2 mb-4">
                <Badge className={statusColors[script.status]} variant="outline">
                  {script.status}
                </Badge>
                <Badge variant="outline" className="border-gray-600 text-gray-400">
                  v{script.version}
                </Badge>
              </div>

              {script.content && (
                <p className="text-sm text-gray-500 line-clamp-3 mb-4">
                  {script.content.substring(0, 150)}...
                </p>
              )}

              <div className="flex items-center gap-2 text-xs text-gray-600">
                <Clock className="w-3 h-3" />
                <span>
                  {script.updated_date 
                    ? format(new Date(script.updated_date), 'd MMM yyyy', { locale: nl })
                    : format(new Date(script.created_date), 'd MMM yyyy', { locale: nl })
                  }
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Form Dialog */}
      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="bg-[#22262b] border-gray-700 text-white max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Nieuw Script</DialogTitle>
          </DialogHeader>
          
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Titel *</Label>
                <Input
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  className="bg-[#1a1d21] border-gray-700"
                  placeholder="Script titel"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>Project</Label>
                <Select 
                  value={formData.project_id} 
                  onValueChange={(v) => setFormData(prev => ({ ...prev, project_id: v }))}
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
            </div>

            <div className="grid grid-cols-2 gap-4">
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
                    {STATUSES.map(s => (
                      <SelectItem key={s} value={s}>{s}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Versie</Label>
                <Input
                  type="number"
                  value={formData.version}
                  onChange={(e) => setFormData(prev => ({ ...prev, version: Number(e.target.value) }))}
                  className="bg-[#1a1d21] border-gray-700"
                  min="1"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Script Inhoud</Label>
              <Textarea
                value={formData.content}
                onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                className="bg-[#1a1d21] border-gray-700 min-h-[300px] font-mono text-sm"
                placeholder="Schrijf hier je script..."
              />
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <Button type="button" variant="outline" onClick={closeForm} className="border-gray-600 text-gray-300">
                Annuleren
              </Button>
              <Button type="submit" className="bg-emerald-500 hover:bg-emerald-600">
                Script Aanmaken
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}