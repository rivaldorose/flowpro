import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Plus, Users, Edit2, Trash2, Mail, Phone, Euro } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const ROLES = ['Director', 'Camera Operator', 'Editor', 'Actor/Talent', 'Photographer', 'Videographer', 'PA', 'Other'];
const AVAILABILITY = ['Available', 'Busy', 'On Project'];

const availabilityColors = {
  'Available': 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
  'Busy': 'bg-red-500/20 text-red-400 border-red-500/30',
  'On Project': 'bg-orange-500/20 text-orange-400 border-orange-500/30',
};

export default function Crew() {
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [editingMember, setEditingMember] = useState(null);
  const [filterRole, setFilterRole] = useState('all');
  const [filterAvailability, setFilterAvailability] = useState('all');
  const [formData, setFormData] = useState({
    name: '',
    role: '',
    email: '',
    phone: '',
    rate: '',
    availability: 'Available',
    skills: []
  });

  const { data: crew = [], isLoading } = useQuery({
    queryKey: ['crew'],
    queryFn: () => base44.entities.CrewMember.list('name'),
  });

  const createMutation = useMutation({
    mutationFn: (data) => base44.entities.CrewMember.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['crew'] });
      closeForm();
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => base44.entities.CrewMember.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['crew'] });
      closeForm();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => base44.entities.CrewMember.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['crew'] });
    },
  });

  const openForm = (member = null) => {
    if (member) {
      setEditingMember(member);
      setFormData({
        name: member.name || '',
        role: member.role || '',
        email: member.email || '',
        phone: member.phone || '',
        rate: member.rate || '',
        availability: member.availability || 'Available',
        skills: member.skills || []
      });
    } else {
      setEditingMember(null);
      setFormData({
        name: '',
        role: '',
        email: '',
        phone: '',
        rate: '',
        availability: 'Available',
        skills: []
      });
    }
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingMember(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = { ...formData, rate: formData.rate ? Number(formData.rate) : null };
    if (editingMember) {
      updateMutation.mutate({ id: editingMember.id, data });
    } else {
      createMutation.mutate(data);
    }
  };

  const filteredCrew = crew.filter(member => {
    if (filterRole !== 'all' && member.role !== filterRole) return false;
    if (filterAvailability !== 'all' && member.availability !== filterAvailability) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-white">Crew Management</h1>
          <p className="text-gray-500 mt-1">{crew.length} crewleden</p>
        </div>
        <Button 
          onClick={() => openForm()}
          className="bg-emerald-500 hover:bg-emerald-600 text-white gap-2"
        >
          <Plus className="w-4 h-4" />
          Nieuw Crewlid
        </Button>
      </div>

      {/* Filters */}
      <div className="bg-[#22262b] rounded-2xl p-4 border border-gray-800/50 flex flex-wrap gap-4">
        <Select value={filterRole} onValueChange={setFilterRole}>
          <SelectTrigger className="w-44 bg-[#1a1d21] border-gray-700 text-white">
            <SelectValue placeholder="Alle Rollen" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Alle Rollen</SelectItem>
            {ROLES.map(r => (
              <SelectItem key={r} value={r}>{r}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={filterAvailability} onValueChange={setFilterAvailability}>
          <SelectTrigger className="w-44 bg-[#1a1d21] border-gray-700 text-white">
            <SelectValue placeholder="Beschikbaarheid" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Alle</SelectItem>
            {AVAILABILITY.map(a => (
              <SelectItem key={a} value={a}>{a}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Crew Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <Skeleton key={i} className="h-48 bg-[#22262b]" />
          ))}
        </div>
      ) : filteredCrew.length === 0 ? (
        <div className="bg-[#22262b] rounded-2xl p-12 text-center border border-gray-800/50">
          <Users className="w-12 h-12 text-gray-600 mx-auto mb-4" />
          <p className="text-gray-400 mb-4">Geen crewleden gevonden</p>
          <Button onClick={() => openForm()} className="bg-emerald-500 hover:bg-emerald-600">
            Voeg je eerste crewlid toe
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filteredCrew.map(member => (
            <div 
              key={member.id}
              className="bg-[#22262b] rounded-2xl p-6 border border-gray-800/50 hover:border-gray-700/50 transition-all group"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={member.photo} />
                    <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-500 text-white">
                      {member.name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-semibold text-white">{member.name}</h3>
                    <Badge variant="outline" className="border-blue-500/30 text-blue-400 bg-blue-500/10">
                      {member.role}
                    </Badge>
                  </div>
                </div>
                
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button variant="ghost" size="icon" onClick={() => openForm(member)} className="h-8 w-8 text-gray-400 hover:text-white">
                    <Edit2 className="w-4 h-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => deleteMutation.mutate(member.id)}
                    className="h-8 w-8 text-gray-400 hover:text-red-400"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <Badge className={availabilityColors[member.availability]} variant="outline">
                {member.availability}
              </Badge>

              <div className="mt-4 space-y-2">
                {member.email && (
                  <div className="flex items-center gap-2 text-sm text-gray-400">
                    <Mail className="w-4 h-4" />
                    <span className="truncate">{member.email}</span>
                  </div>
                )}
                {member.phone && (
                  <div className="flex items-center gap-2 text-sm text-gray-400">
                    <Phone className="w-4 h-4" />
                    <span>{member.phone}</span>
                  </div>
                )}
                {member.rate && (
                  <div className="flex items-center gap-2 text-sm text-gray-400">
                    <Euro className="w-4 h-4" />
                    <span>€{member.rate}/dag</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Form Dialog */}
      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="bg-[#22262b] border-gray-700 text-white max-w-md">
          <DialogHeader>
            <DialogTitle>{editingMember ? 'Crewlid Bewerken' : 'Nieuw Crewlid'}</DialogTitle>
          </DialogHeader>
          
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label>Naam *</Label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                className="bg-[#1a1d21] border-gray-700"
                placeholder="Volledige naam"
                required
              />
            </div>

            <div className="space-y-2">
              <Label>Rol *</Label>
              <Select 
                value={formData.role} 
                onValueChange={(v) => setFormData(prev => ({ ...prev, role: v }))}
              >
                <SelectTrigger className="bg-[#1a1d21] border-gray-700">
                  <SelectValue placeholder="Selecteer rol" />
                </SelectTrigger>
                <SelectContent>
                  {ROLES.map(r => (
                    <SelectItem key={r} value={r}>{r}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Email</Label>
                <Input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  className="bg-[#1a1d21] border-gray-700"
                  placeholder="email@voorbeeld.nl"
                />
              </div>
              <div className="space-y-2">
                <Label>Telefoon</Label>
                <Input
                  value={formData.phone}
                  onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                  className="bg-[#1a1d21] border-gray-700"
                  placeholder="+31 6..."
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Dagtarief (€)</Label>
                <Input
                  type="number"
                  value={formData.rate}
                  onChange={(e) => setFormData(prev => ({ ...prev, rate: e.target.value }))}
                  className="bg-[#1a1d21] border-gray-700"
                  placeholder="500"
                />
              </div>
              <div className="space-y-2">
                <Label>Beschikbaarheid</Label>
                <Select 
                  value={formData.availability} 
                  onValueChange={(v) => setFormData(prev => ({ ...prev, availability: v }))}
                >
                  <SelectTrigger className="bg-[#1a1d21] border-gray-700">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {AVAILABILITY.map(a => (
                      <SelectItem key={a} value={a}>{a}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <Button type="button" variant="outline" onClick={closeForm} className="border-gray-600 text-gray-300">
                Annuleren
              </Button>
              <Button type="submit" className="bg-emerald-500 hover:bg-emerald-600">
                {editingMember ? 'Opslaan' : 'Toevoegen'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}