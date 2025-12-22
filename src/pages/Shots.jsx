import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Plus, ArrowUpDown, Film, Trash2, Search, Upload, X } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const SHOT_TYPES = ['Wide', 'Medium', 'Close-up', 'POV', 'Over Shoulder', 'B-Roll'];
const CAMERA_ANGLES = ['Eye Level', 'High Angle', 'Low Angle', 'Dutch Angle'];
const STATUSES = ['Not Shot', 'In Progress', 'Completed', 'Rejected'];
const PRIORITIES = ['Must Have', 'Nice to Have', 'Optional'];

export default function Shots() {
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [filterProject, setFilterProject] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortField, setSortField] = useState('shot_number');
  const [sortDirection, setSortDirection] = useState('asc');
  
  const [formData, setFormData] = useState({
    project_id: '',
    shot_number: '',
    scene_description: '',
    shot_type: 'Wide',
    camera_angle: 'Eye Level',
    duration: '',
    status: 'Not Shot',
    priority: 'Must Have',
    reference_image: '',
    notes: ''
  });
  const [uploadingImage, setUploadingImage] = useState(false);

  const { data: shots = [], isLoading } = useQuery({
    queryKey: ['shots'],
    queryFn: () => base44.entities.Shot.list('-shot_number'),
  });

  const { data: projects = [] } = useQuery({
    queryKey: ['projects'],
    queryFn: () => base44.entities.Project.list(),
  });

  const createMutation = useMutation({
    mutationFn: (data) => base44.entities.Shot.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['shots'] });
      closeForm();
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => base44.entities.Shot.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['shots'] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => base44.entities.Shot.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['shots'] });
    },
  });

  const closeForm = () => {
    setShowForm(false);
    setFormData({
      project_id: '',
      shot_number: '',
      scene_description: '',
      shot_type: 'Wide',
      camera_angle: 'Eye Level',
      duration: '',
      status: 'Not Shot',
      priority: 'Must Have',
      reference_image: '',
      notes: ''
    });
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    try {
      const { file_url } = await base44.integrations.Core.UploadFile({ file });
      setFormData(prev => ({ ...prev, reference_image: file_url }));
    } catch (error) {
      console.error('Image upload failed:', error);
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    createMutation.mutate(formData);
  };

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const handleInlineEdit = (shot, field, value) => {
    updateMutation.mutate({ 
      id: shot.id, 
      data: { ...shot, [field]: value } 
    });
  };

  const projectMap = projects.reduce((acc, p) => ({ ...acc, [p.id]: p }), {});

  let filteredShots = shots.filter(s => {
    if (filterProject !== 'all' && s.project_id !== filterProject) return false;
    if (filterStatus !== 'all' && s.status !== filterStatus) return false;
    if (searchQuery && !s.scene_description.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });
  
  filteredShots.sort((a, b) => {
    let aVal = a[sortField];
    let bVal = b[sortField];
    
    if (sortField === 'shot_number') {
      aVal = Number(aVal) || 0;
      bVal = Number(bVal) || 0;
    }
    
    if (aVal < bVal) return sortDirection === 'asc' ? -1 : 1;
    if (aVal > bVal) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });

  const stats = {
    total: shots.length,
    completed: shots.filter(s => s.status === 'Completed').length,
    inProgress: shots.filter(s => s.status === 'In Progress').length,
    notShot: shots.filter(s => s.status === 'Not Shot').length,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-white">Shot List</h1>
          <p className="text-gray-500 mt-1">
            {stats.total} shots • {stats.completed} afgerond • {stats.inProgress} bezig
          </p>
        </div>
        <Button onClick={() => setShowForm(true)} className="bg-emerald-500 hover:bg-emerald-600 gap-2">
          <Plus className="w-4 h-4" />
          Nieuwe Shot
        </Button>
      </div>

      {/* Filters */}
      <div className="bg-[#22262b] rounded-2xl p-4 border border-gray-800/50 flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <Input
            placeholder="Zoek shots..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-[#1a1d21] border-gray-700 text-white"
          />
        </div>
        
        <Select value={filterProject} onValueChange={setFilterProject}>
          <SelectTrigger className="w-48 bg-[#1a1d21] border-gray-700 text-white">
            <SelectValue placeholder="Project" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Alle Projecten</SelectItem>
            {projects.map(p => (
              <SelectItem key={p.id} value={p.id}>{p.title}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="w-48 bg-[#1a1d21] border-gray-700 text-white">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Alle Statussen</SelectItem>
            {STATUSES.map(s => (
              <SelectItem key={s} value={s}>{s}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      {isLoading ? (
        <div className="space-y-2">
          {[1, 2, 3, 4, 5].map(i => (
            <Skeleton key={i} className="h-16 bg-[#22262b]" />
          ))}
        </div>
      ) : shots.length === 0 ? (
        <div className="bg-[#22262b] rounded-2xl p-12 text-center border border-gray-800/50">
          <Film className="w-12 h-12 text-gray-600 mx-auto mb-4" />
          <p className="text-gray-400 mb-4">Nog geen shots toegevoegd</p>
          <Button onClick={() => setShowForm(true)} className="bg-emerald-500 hover:bg-emerald-600">
            Voeg eerste shot toe
          </Button>
        </div>
      ) : (
        <div className="bg-[#22262b] rounded-2xl border border-gray-800/50 overflow-hidden">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-gray-800 hover:bg-transparent">
                  <TableHead className="text-gray-400">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => handleSort('shot_number')}
                      className="gap-2 text-gray-400 hover:text-white"
                    >
                      Shot # <ArrowUpDown className="w-3 h-3" />
                    </Button>
                  </TableHead>
                  <TableHead className="text-gray-400">Project</TableHead>
                  <TableHead className="text-gray-400">Scene</TableHead>
                  <TableHead className="text-gray-400">Type</TableHead>
                  <TableHead className="text-gray-400">Angle</TableHead>
                  <TableHead className="text-gray-400">Duration</TableHead>
                  <TableHead className="text-gray-400">Status</TableHead>
                  <TableHead className="text-gray-400">Priority</TableHead>
                  <TableHead className="text-gray-400 text-right">Acties</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredShots.map(shot => (
                  <TableRow key={shot.id} className="border-gray-800 hover:bg-[#1a1d21]">
                    <TableCell className="font-medium text-white">
                      #{shot.shot_number}
                    </TableCell>
                    <TableCell className="text-gray-400 text-sm">
                      {projectMap[shot.project_id]?.title || '-'}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        {shot.reference_image && (
                          <img 
                            src={shot.reference_image} 
                            alt="Reference" 
                            className="w-12 h-12 object-cover rounded"
                          />
                        )}
                        <div className="max-w-xs">
                          <p className="text-white text-sm truncate">{shot.scene_description}</p>
                          {shot.notes && (
                            <p className="text-xs text-gray-500 truncate">{shot.notes}</p>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Select 
                        value={shot.shot_type} 
                        onValueChange={(v) => handleInlineEdit(shot, 'shot_type', v)}
                      >
                        <SelectTrigger className="h-8 w-32 bg-[#1a1d21] border-gray-700 text-white text-xs">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {SHOT_TYPES.map(t => (
                            <SelectItem key={t} value={t}>{t}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell>
                      <Select 
                        value={shot.camera_angle} 
                        onValueChange={(v) => handleInlineEdit(shot, 'camera_angle', v)}
                      >
                        <SelectTrigger className="h-8 w-32 bg-[#1a1d21] border-gray-700 text-white text-xs">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {CAMERA_ANGLES.map(a => (
                            <SelectItem key={a} value={a}>{a}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell className="text-gray-400 text-sm">
                      {shot.duration || '-'}
                    </TableCell>
                    <TableCell>
                      <Select 
                        value={shot.status} 
                        onValueChange={(v) => handleInlineEdit(shot, 'status', v)}
                      >
                        <SelectTrigger className="h-8 w-36 bg-[#1a1d21] border-gray-700 text-xs">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {STATUSES.map(s => (
                            <SelectItem key={s} value={s}>{s}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell>
                      <Select 
                        value={shot.priority} 
                        onValueChange={(v) => handleInlineEdit(shot, 'priority', v)}
                      >
                        <SelectTrigger className="h-8 w-36 bg-[#1a1d21] border-gray-700 text-xs">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {PRIORITIES.map(p => (
                            <SelectItem key={p} value={p}>{p}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => deleteMutation.mutate(shot.id)}
                        className="h-8 w-8 text-gray-400 hover:text-red-400"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      )}

      {/* Add Form Dialog */}
      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="bg-[#22262b] border-gray-700 text-white max-w-2xl">
          <DialogHeader>
            <DialogTitle>Nieuwe Shot</DialogTitle>
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

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Shot Nummer *</Label>
                <Input
                  type="number"
                  value={formData.shot_number}
                  onChange={(e) => setFormData(prev => ({ ...prev, shot_number: e.target.value }))}
                  className="bg-[#1a1d21] border-gray-700"
                  placeholder="1"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label>Duration</Label>
                <Input
                  value={formData.duration}
                  onChange={(e) => setFormData(prev => ({ ...prev, duration: e.target.value }))}
                  className="bg-[#1a1d21] border-gray-700"
                  placeholder="10s"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Scene Beschrijving *</Label>
              <Textarea
                value={formData.scene_description}
                onChange={(e) => setFormData(prev => ({ ...prev, scene_description: e.target.value }))}
                className="bg-[#1a1d21] border-gray-700"
                placeholder="Beschrijf de scene..."
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Shot Type</Label>
                <Select 
                  value={formData.shot_type} 
                  onValueChange={(v) => setFormData(prev => ({ ...prev, shot_type: v }))}
                >
                  <SelectTrigger className="bg-[#1a1d21] border-gray-700">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {SHOT_TYPES.map(t => (
                      <SelectItem key={t} value={t}>{t}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Camera Angle</Label>
                <Select 
                  value={formData.camera_angle} 
                  onValueChange={(v) => setFormData(prev => ({ ...prev, camera_angle: v }))}
                >
                  <SelectTrigger className="bg-[#1a1d21] border-gray-700">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {CAMERA_ANGLES.map(a => (
                      <SelectItem key={a} value={a}>{a}</SelectItem>
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
                <Label>Priority</Label>
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
              <Label>Referentie Foto</Label>
              {formData.reference_image ? (
                <div className="relative">
                  <img 
                    src={formData.reference_image} 
                    alt="Reference" 
                    className="w-full h-48 object-cover rounded-lg"
                  />
                  <Button
                    type="button"
                    size="icon"
                    variant="ghost"
                    onClick={() => setFormData(prev => ({ ...prev, reference_image: '' }))}
                    className="absolute top-2 right-2 bg-black/50 hover:bg-black/70 text-white"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              ) : (
                <div className="border-2 border-dashed border-gray-700 rounded-lg p-8 text-center">
                  <input
                    type="file"
                    id="image-upload"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                  <label htmlFor="image-upload" className="cursor-pointer">
                    <Upload className="w-8 h-8 text-gray-500 mx-auto mb-2" />
                    <p className="text-sm text-gray-400">
                      {uploadingImage ? 'Uploading...' : 'Klik om foto te uploaden'}
                    </p>
                  </label>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label>Notities</Label>
              <Textarea
                value={formData.notes}
                onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                className="bg-[#1a1d21] border-gray-700"
                placeholder="Extra notities..."
              />
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <Button type="button" variant="outline" onClick={closeForm} className="border-gray-600 text-gray-300">
                Annuleren
              </Button>
              <Button type="submit" className="bg-emerald-500 hover:bg-emerald-600">
                Shot Toevoegen
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}