import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { MapPin, Package, Users, Sparkles, Clock, Shirt, Music, CheckCircle2, Circle, Loader2, Plus } from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const categoryIcons = {
  locations: MapPin,
  props: Package,
  crew: Users,
  vfx: Sparkles,
  time: Clock,
  wardrobe: Shirt,
  sound: Music,
};

const categoryColors = {
  locations: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  props: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
  crew: 'bg-green-500/20 text-green-400 border-green-500/30',
  vfx: 'bg-pink-500/20 text-pink-400 border-pink-500/30',
  time: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
  wardrobe: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  sound: 'bg-red-500/20 text-red-400 border-red-500/30',
};

const statusColors = {
  'To Do': 'bg-gray-500/20 text-gray-400 border-gray-500/30',
  'In Progress': 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  'Done': 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
};

export default function ProductionTaskList({ projectId }) {
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    category: 'props',
    item: '',
    notes: '',
    status: 'To Do'
  });

  const { data: tasks = [], isLoading } = useQuery({
    queryKey: ['productionTasks', projectId],
    queryFn: () => base44.entities.ProductionTask.filter({ project_id: projectId }),
    enabled: !!projectId,
  });

  const createMutation = useMutation({
    mutationFn: (data) => base44.entities.ProductionTask.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['productionTasks', projectId] });
      setShowForm(false);
      setFormData({ category: 'props', item: '', notes: '', status: 'To Do' });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => base44.entities.ProductionTask.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['productionTasks', projectId] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => base44.entities.ProductionTask.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['productionTasks', projectId] });
    },
  });

  const handleStatusChange = (task, newStatus) => {
    updateMutation.mutate({ id: task.id, data: { ...task, status: newStatus } });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    createMutation.mutate({
      project_id: projectId,
      script_id: '',
      category: formData.category,
      item: formData.item,
      notes: formData.notes,
      status: formData.status
    });
  };

  const groupedTasks = tasks.reduce((acc, task) => {
    if (!acc[task.category]) acc[task.category] = [];
    acc[task.category].push(task);
    return acc;
  }, {});

  const stats = {
    total: tasks.length,
    done: tasks.filter(t => t.status === 'Done').length,
    inProgress: tasks.filter(t => t.status === 'In Progress').length,
    toDo: tasks.filter(t => t.status === 'To Do').length,
  };

  if (isLoading) {
    return (
      <div className="bg-[#22262b] rounded-2xl p-6 border border-gray-800/50">
        <div className="flex items-center justify-center h-48">
          <Loader2 className="w-8 h-8 text-gray-500 animate-spin" />
        </div>
      </div>
    );
  }

  if (tasks.length === 0) {
    return (
      <div className="bg-[#22262b] rounded-2xl p-6 border border-gray-800/50 text-center">
        <p className="text-gray-400 text-sm">Geen productietaken. Maak taken vanuit een script breakdown.</p>
      </div>
    );
  }

  return (
    <div className="bg-[#22262b] rounded-2xl p-6 border border-gray-800/50">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white">Productie Taken</h3>
          <Button 
            onClick={() => setShowForm(true)}
            size="sm"
            className="bg-emerald-500 hover:bg-emerald-600 gap-2"
          >
            <Plus className="w-4 h-4" />
            Taak Toevoegen
          </Button>
        </div>
        
        <div className="grid grid-cols-4 gap-3">
          <div className="bg-[#1a1d21] rounded-lg p-3 border border-gray-700/50">
            <p className="text-xs text-gray-500">Totaal</p>
            <p className="text-xl font-bold text-white">{stats.total}</p>
          </div>
          <div className="bg-[#1a1d21] rounded-lg p-3 border border-gray-700/50">
            <p className="text-xs text-gray-500">Te Doen</p>
            <p className="text-xl font-bold text-gray-400">{stats.toDo}</p>
          </div>
          <div className="bg-[#1a1d21] rounded-lg p-3 border border-blue-500/30">
            <p className="text-xs text-blue-400">Bezig</p>
            <p className="text-xl font-bold text-blue-400">{stats.inProgress}</p>
          </div>
          <div className="bg-[#1a1d21] rounded-lg p-3 border border-emerald-500/30">
            <p className="text-xs text-emerald-400">Klaar</p>
            <p className="text-xl font-bold text-emerald-400">{stats.done}</p>
          </div>
        </div>
      </div>

      <ScrollArea className="h-[500px] pr-4">
        <div className="space-y-6">
          {Object.entries(groupedTasks).map(([category, categoryTasks]) => {
            const Icon = categoryIcons[category] || Package;
            
            return (
              <div key={category}>
                <div className="flex items-center gap-2 mb-3">
                  <Icon className="w-4 h-4 text-gray-400" />
                  <h4 className="text-sm font-semibold text-white capitalize">{category}</h4>
                  <Badge variant="outline" className="text-xs border-gray-600 text-gray-400">
                    {categoryTasks.length}
                  </Badge>
                </div>

                <div className="space-y-2">
                  {categoryTasks.map(task => (
                    <div
                      key={task.id}
                      className="bg-[#1a1d21] rounded-lg p-3 border border-gray-700/50 hover:border-gray-600/50 transition-all"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          <p className={`text-sm text-white ${task.status === 'Done' ? 'line-through opacity-60' : ''}`}>
                            {task.item}
                          </p>
                          {task.notes && (
                            <p className="text-xs text-gray-500 mt-1">{task.notes}</p>
                          )}
                        </div>

                        <div className="flex items-center gap-2">
                          <Select 
                            value={task.status} 
                            onValueChange={(v) => handleStatusChange(task, v)}
                          >
                            <SelectTrigger className="h-7 w-32 bg-[#22262b] border-gray-700 text-xs">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="To Do">Te Doen</SelectItem>
                              <SelectItem value="In Progress">Bezig</SelectItem>
                              <SelectItem value="Done">Klaar</SelectItem>
                            </SelectContent>
                          </Select>

                          {task.status === 'Done' && (
                            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </ScrollArea>

      {/* Add Task Dialog */}
      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="bg-[#22262b] border-gray-700 text-white max-w-lg">
          <DialogHeader>
            <DialogTitle>Nieuwe Productie Taak</DialogTitle>
          </DialogHeader>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label>Categorie *</Label>
              <Select 
                value={formData.category} 
                onValueChange={(v) => setFormData(prev => ({ ...prev, category: v }))}
              >
                <SelectTrigger className="bg-[#1a1d21] border-gray-700">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="locations">Locaties</SelectItem>
                  <SelectItem value="props">Props</SelectItem>
                  <SelectItem value="crew">Crew/Talent</SelectItem>
                  <SelectItem value="vfx">VFX</SelectItem>
                  <SelectItem value="time">Time of Day</SelectItem>
                  <SelectItem value="wardrobe">Wardrobe</SelectItem>
                  <SelectItem value="sound">Sound/Music</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Taak *</Label>
              <Input
                value={formData.item}
                onChange={(e) => setFormData(prev => ({ ...prev, item: e.target.value }))}
                className="bg-[#1a1d21] border-gray-700"
                placeholder="Beschrijf de taak..."
                required
              />
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
                  <SelectItem value="To Do">Te Doen</SelectItem>
                  <SelectItem value="In Progress">Bezig</SelectItem>
                  <SelectItem value="Done">Klaar</SelectItem>
                </SelectContent>
              </Select>
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
              <Button type="button" variant="outline" onClick={() => setShowForm(false)} className="border-gray-600 text-gray-300">
                Annuleren
              </Button>
              <Button type="submit" className="bg-emerald-500 hover:bg-emerald-600">
                Taak Toevoegen
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}