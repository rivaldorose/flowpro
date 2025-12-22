import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Plus, User, Mail, Phone, Trash2 } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";

const statusColors = {
  'Open': 'bg-gray-500/20 text-gray-400 border-gray-500/30',
  'Casting': 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  'Booked': 'bg-orange-500/20 text-orange-400 border-orange-500/30',
  'Confirmed': 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
};

export default function CastingList({ projectId }) {
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    role_name: '',
    description: '',
    actor_name: '',
    actor_email: '',
    actor_phone: '',
    status: 'Open',
    audition_date: '',
    notes: ''
  });

  const { data: castings = [], isLoading } = useQuery({
    queryKey: ['castings', projectId],
    queryFn: () => base44.entities.Casting.filter({ project_id: projectId }),
    enabled: !!projectId,
  });

  const createMutation = useMutation({
    mutationFn: (data) => base44.entities.Casting.create({ ...data, project_id: projectId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['castings', projectId] });
      setShowForm(false);
      resetForm();
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => base44.entities.Casting.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['castings', projectId] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => base44.entities.Casting.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['castings', projectId] });
    },
  });

  const resetForm = () => {
    setFormData({
      role_name: '',
      description: '',
      actor_name: '',
      actor_email: '',
      actor_phone: '',
      status: 'Open',
      audition_date: '',
      notes: ''
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    createMutation.mutate(formData);
  };

  const handleStatusChange = (casting, newStatus) => {
    updateMutation.mutate({ id: casting.id, data: { ...casting, status: newStatus } });
  };

  if (isLoading) {
    return <div className="text-gray-400">Laden...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-white">Casting ({castings.length})</h3>
        <Button onClick={() => setShowForm(true)} className="bg-emerald-500 hover:bg-emerald-600 gap-2">
          <Plus className="w-4 h-4" />
          Nieuwe Rol
        </Button>
      </div>

      {castings.length === 0 ? (
        <div className="bg-[#22262b] rounded-2xl p-12 text-center border border-gray-800/50">
          <User className="w-12 h-12 text-gray-600 mx-auto mb-4" />
          <p className="text-gray-400 mb-4">Nog geen casting rollen</p>
          <Button onClick={() => setShowForm(true)} className="bg-emerald-500 hover:bg-emerald-600">
            Voeg eerste rol toe
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {castings.map(casting => (
            <div key={casting.id} className="bg-[#22262b] rounded-xl p-6 border border-gray-800/50">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h4 className="font-semibold text-white text-lg">{casting.role_name}</h4>
                  {casting.description && (
                    <p className="text-sm text-gray-400 mt-1">{casting.description}</p>
                  )}
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => deleteMutation.mutate(casting.id)}
                  className="text-gray-400 hover:text-red-400 h-8 w-8"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>

              <div className="mb-4">
                <Select value={casting.status} onValueChange={(v) => handleStatusChange(casting, v)}>
                  <SelectTrigger className="bg-[#1a1d21] border-gray-700 h-9">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Open">Open</SelectItem>
                    <SelectItem value="Casting">Casting</SelectItem>
                    <SelectItem value="Booked">Geboekt</SelectItem>
                    <SelectItem value="Confirmed">Bevestigd</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {casting.actor_name && (
                <div className="space-y-2 pt-3 border-t border-gray-800">
                  <div className="flex items-center gap-2 text-sm">
                    <User className="w-4 h-4 text-gray-500" />
                    <span className="text-white">{casting.actor_name}</span>
                  </div>
                  {casting.actor_email && (
                    <div className="flex items-center gap-2 text-sm">
                      <Mail className="w-4 h-4 text-gray-500" />
                      <span className="text-gray-400">{casting.actor_email}</span>
                    </div>
                  )}
                  {casting.actor_phone && (
                    <div className="flex items-center gap-2 text-sm">
                      <Phone className="w-4 h-4 text-gray-500" />
                      <span className="text-gray-400">{casting.actor_phone}</span>
                    </div>
                  )}
                </div>
              )}

              {casting.notes && (
                <div className="mt-3 pt-3 border-t border-gray-800">
                  <p className="text-xs text-gray-500">{casting.notes}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="bg-[#22262b] border-gray-700 text-white max-w-lg">
          <DialogHeader>
            <DialogTitle>Nieuwe Casting Rol</DialogTitle>
          </DialogHeader>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label>Rol Naam *</Label>
              <Input
                value={formData.role_name}
                onChange={(e) => setFormData(prev => ({ ...prev, role_name: e.target.value }))}
                className="bg-[#1a1d21] border-gray-700"
                placeholder="Bijv. Hoofdpersoon"
                required
              />
            </div>

            <div className="space-y-2">
              <Label>Beschrijving</Label>
              <Textarea
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                className="bg-[#1a1d21] border-gray-700 min-h-[60px]"
                placeholder="Rol beschrijving..."
              />
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
                    <SelectItem value="Open">Open</SelectItem>
                    <SelectItem value="Casting">Casting</SelectItem>
                    <SelectItem value="Booked">Geboekt</SelectItem>
                    <SelectItem value="Confirmed">Bevestigd</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Auditie Datum</Label>
                <Input
                  type="date"
                  value={formData.audition_date}
                  onChange={(e) => setFormData(prev => ({ ...prev, audition_date: e.target.value }))}
                  className="bg-[#1a1d21] border-gray-700"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Acteur Naam</Label>
              <Input
                value={formData.actor_name}
                onChange={(e) => setFormData(prev => ({ ...prev, actor_name: e.target.value }))}
                className="bg-[#1a1d21] border-gray-700"
                placeholder="Naam van de acteur"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Email</Label>
                <Input
                  type="email"
                  value={formData.actor_email}
                  onChange={(e) => setFormData(prev => ({ ...prev, actor_email: e.target.value }))}
                  className="bg-[#1a1d21] border-gray-700"
                  placeholder="email@example.com"
                />
              </div>

              <div className="space-y-2">
                <Label>Telefoon</Label>
                <Input
                  value={formData.actor_phone}
                  onChange={(e) => setFormData(prev => ({ ...prev, actor_phone: e.target.value }))}
                  className="bg-[#1a1d21] border-gray-700"
                  placeholder="+31 6 1234 5678"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Notities</Label>
              <Textarea
                value={formData.notes}
                onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                className="bg-[#1a1d21] border-gray-700 min-h-[60px]"
                placeholder="Extra notities..."
              />
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <Button type="button" variant="outline" onClick={() => setShowForm(false)} className="border-gray-600 text-gray-300">
                Annuleren
              </Button>
              <Button type="submit" className="bg-emerald-500 hover:bg-emerald-600">
                Rol Toevoegen
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}