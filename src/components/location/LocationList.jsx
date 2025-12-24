import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Location } from '@/api/entities';
import { UploadFile } from '@/api/integrations';
import { Plus, MapPin, Phone, Mail, Euro, Trash2, Upload, X, CheckCircle2, Clock, XCircle } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";

const statusColors = {
  'Scouting': 'bg-gray-500/20 text-gray-400 border-gray-500/30',
  'Pending': 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  'Confirmed': 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
  'Rejected': 'bg-red-500/20 text-red-400 border-red-500/30',
};

const statusIcons = {
  'Scouting': Clock,
  'Pending': Clock,
  'Confirmed': CheckCircle2,
  'Rejected': XCircle,
};

export default function LocationList({ projectId }) {
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    type: 'Interior',
    status: 'Pending',
    contact_name: '',
    contact_phone: '',
    contact_email: '',
    cost: '',
    availability: '',
    notes: '',
    photos: []
  });

  const { data: locations = [], isLoading } = useQuery({
    queryKey: ['locations', projectId],
    queryFn: () => Location.filter({ project_id: projectId }),
    enabled: !!projectId,
  });

  const createMutation = useMutation({
    mutationFn: (data) => Location.create({ ...data, project_id: projectId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['locations', projectId] });
      closeForm();
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => Location.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['locations', projectId] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => Location.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['locations', projectId] });
    },
  });

  const closeForm = () => {
    setShowForm(false);
    setFormData({
      name: '',
      address: '',
      type: 'Interior',
      status: 'Pending',
      contact_name: '',
      contact_phone: '',
      contact_email: '',
      cost: '',
      availability: '',
      notes: '',
      photos: []
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    createMutation.mutate(formData);
  };

  const handlePhotoUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingPhoto(true);
    try {
      const { file_url } = await UploadFile({ file });
      setFormData(prev => ({
        ...prev,
        photos: [...(prev.photos || []), file_url]
      }));
    } catch (error) {
      console.error('Photo upload failed:', error);
    } finally {
      setUploadingPhoto(false);
    }
  };

  const removePhoto = (photoUrl) => {
    setFormData(prev => ({
      ...prev,
      photos: prev.photos.filter(p => p !== photoUrl)
    }));
  };

  const handleStatusChange = (location, newStatus) => {
    updateMutation.mutate({ 
      id: location.id, 
      data: { ...location, status: newStatus } 
    });
  };

  if (isLoading) {
    return <div className="text-gray-400">Laden...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-white">Locaties ({locations.length})</h3>
        <Button onClick={() => setShowForm(true)} className="bg-emerald-500 hover:bg-emerald-600 gap-2">
          <Plus className="w-4 h-4" />
          Nieuwe Locatie
        </Button>
      </div>

      {locations.length === 0 ? (
        <div className="bg-[#22262b] rounded-2xl p-12 text-center border border-gray-800/50">
          <MapPin className="w-12 h-12 text-gray-600 mx-auto mb-4" />
          <p className="text-gray-400 mb-4">Nog geen locaties toegevoegd</p>
          <Button onClick={() => setShowForm(true)} className="bg-emerald-500 hover:bg-emerald-600">
            Voeg eerste locatie toe
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {locations.map(location => {
            const StatusIcon = statusIcons[location.status];
            
            return (
              <div key={location.id} className="bg-[#22262b] rounded-xl border border-gray-800/50 overflow-hidden">
                {location.photos?.length > 0 && (
                  <div className="relative h-48 bg-gray-800">
                    <img 
                      src={location.photos[0]} 
                      alt={location.name}
                      className="w-full h-full object-cover"
                    />
                    {location.photos.length > 1 && (
                      <div className="absolute top-2 right-2 bg-black/60 px-2 py-1 rounded text-xs text-white">
                        +{location.photos.length - 1} foto's
                      </div>
                    )}
                  </div>
                )}
                
                <div className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h4 className="font-semibold text-white text-lg mb-1">{location.name}</h4>
                      {location.address && (
                        <p className="text-sm text-gray-400 flex items-start gap-1">
                          <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                          {location.address}
                        </p>
                      )}
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => deleteMutation.mutate(location.id)}
                      className="text-gray-400 hover:text-red-400 h-8 w-8"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>

                  <div className="flex items-center gap-2 mb-3">
                    <Badge variant="outline" className="border-gray-600 text-gray-400">
                      {location.type}
                    </Badge>
                    <Select 
                      value={location.status} 
                      onValueChange={(v) => handleStatusChange(location, v)}
                    >
                      <SelectTrigger className="h-7 w-auto bg-[#1a1d21] border-0">
                        <Badge className={statusColors[location.status]} variant="outline">
                          <StatusIcon className="w-3 h-3 mr-1" />
                          {location.status}
                        </Badge>
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Scouting">Scouting</SelectItem>
                        <SelectItem value="Pending">Pending</SelectItem>
                        <SelectItem value="Confirmed">Bevestigd</SelectItem>
                        <SelectItem value="Rejected">Afgewezen</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {(location.contact_name || location.contact_phone || location.contact_email) && (
                    <div className="space-y-1 mb-3 pt-3 border-t border-gray-800">
                      {location.contact_name && (
                        <p className="text-sm text-gray-400">Contact: {location.contact_name}</p>
                      )}
                      {location.contact_phone && (
                        <p className="text-sm text-gray-400 flex items-center gap-1">
                          <Phone className="w-3 h-3" />
                          {location.contact_phone}
                        </p>
                      )}
                      {location.contact_email && (
                        <p className="text-sm text-gray-400 flex items-center gap-1">
                          <Mail className="w-3 h-3" />
                          {location.contact_email}
                        </p>
                      )}
                    </div>
                  )}

                  {location.cost && (
                    <div className="flex items-center gap-1 text-emerald-400 mb-2">
                      <Euro className="w-4 h-4" />
                      <span className="font-medium">€{location.cost.toLocaleString()}</span>
                    </div>
                  )}

                  {location.availability && (
                    <p className="text-xs text-gray-500 mb-2">
                      <strong>Beschikbaarheid:</strong> {location.availability}
                    </p>
                  )}

                  {location.notes && (
                    <p className="text-xs text-gray-500 pt-2 border-t border-gray-800">
                      {location.notes}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add Form */}
      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="bg-[#22262b] border-gray-700 text-white max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Nieuwe Locatie</DialogTitle>
          </DialogHeader>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label>Naam *</Label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                className="bg-[#1a1d21] border-gray-700"
                placeholder="Locatie naam"
                required
              />
            </div>

            <div className="space-y-2">
              <Label>Adres</Label>
              <Textarea
                value={formData.address}
                onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                className="bg-[#1a1d21] border-gray-700"
                placeholder="Volledig adres"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Type</Label>
                <Select 
                  value={formData.type} 
                  onValueChange={(v) => setFormData(prev => ({ ...prev, type: v }))}
                >
                  <SelectTrigger className="bg-[#1a1d21] border-gray-700">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Interior">Interior</SelectItem>
                    <SelectItem value="Exterior">Exterior</SelectItem>
                    <SelectItem value="Studio">Studio</SelectItem>
                    <SelectItem value="Public Space">Public Space</SelectItem>
                    <SelectItem value="Private Property">Private Property</SelectItem>
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
                    <SelectItem value="Scouting">Scouting</SelectItem>
                    <SelectItem value="Pending">Pending</SelectItem>
                    <SelectItem value="Confirmed">Bevestigd</SelectItem>
                    <SelectItem value="Rejected">Afgewezen</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Contact Persoon</Label>
              <Input
                value={formData.contact_name}
                onChange={(e) => setFormData(prev => ({ ...prev, contact_name: e.target.value }))}
                className="bg-[#1a1d21] border-gray-700"
                placeholder="Naam"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Telefoon</Label>
                <Input
                  value={formData.contact_phone}
                  onChange={(e) => setFormData(prev => ({ ...prev, contact_phone: e.target.value }))}
                  className="bg-[#1a1d21] border-gray-700"
                  placeholder="+31 6 1234 5678"
                />
              </div>

              <div className="space-y-2">
                <Label>Email</Label>
                <Input
                  type="email"
                  value={formData.contact_email}
                  onChange={(e) => setFormData(prev => ({ ...prev, contact_email: e.target.value }))}
                  className="bg-[#1a1d21] border-gray-700"
                  placeholder="email@example.com"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Kosten (€)</Label>
                <Input
                  type="number"
                  value={formData.cost}
                  onChange={(e) => setFormData(prev => ({ ...prev, cost: e.target.value }))}
                  className="bg-[#1a1d21] border-gray-700"
                  placeholder="0"
                />
              </div>

              <div className="space-y-2">
                <Label>Beschikbaarheid</Label>
                <Input
                  value={formData.availability}
                  onChange={(e) => setFormData(prev => ({ ...prev, availability: e.target.value }))}
                  className="bg-[#1a1d21] border-gray-700"
                  placeholder="Ma-Vr 9-17"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Foto's</Label>
              {formData.photos?.length > 0 && (
                <div className="grid grid-cols-3 gap-2 mb-2">
                  {formData.photos.map((photo, idx) => (
                    <div key={idx} className="relative">
                      <img src={photo} alt={`Photo ${idx + 1}`} className="w-full h-24 object-cover rounded" />
                      <Button
                        type="button"
                        size="icon"
                        variant="ghost"
                        onClick={() => removePhoto(photo)}
                        className="absolute top-1 right-1 bg-black/50 hover:bg-black/70 text-white h-6 w-6"
                      >
                        <X className="w-3 h-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
              <div className="border-2 border-dashed border-gray-700 rounded-lg p-6 text-center">
                <input
                  type="file"
                  id="photo-upload"
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  className="hidden"
                />
                <label htmlFor="photo-upload" className="cursor-pointer">
                  <Upload className="w-6 h-6 text-gray-500 mx-auto mb-1" />
                  <p className="text-xs text-gray-400">
                    {uploadingPhoto ? 'Uploading...' : 'Foto toevoegen'}
                  </p>
                </label>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Notities</Label>
              <Textarea
                value={formData.notes}
                onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                className="bg-[#1a1d21] border-gray-700"
                placeholder="Extra informatie..."
              />
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <Button type="button" variant="outline" onClick={closeForm} className="border-gray-600 text-gray-300">
                Annuleren
              </Button>
              <Button type="submit" className="bg-emerald-500 hover:bg-emerald-600">
                Locatie Toevoegen
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}