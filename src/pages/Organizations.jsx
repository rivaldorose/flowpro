import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Business, Project } from '@/api/entities';
import { Plus, Building2, Edit2, Trash2, FolderKanban, Search } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

const INDUSTRIES = ['Fintech', 'Media', 'SaaS', 'E-commerce', 'Other'];

export default function Organizations() {
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [editingOrganization, setEditingOrganization] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    industry: '',
    brand_colors: '',
    status: 'Active'
  });

  const { data: organizations = [], isLoading } = useQuery({
    queryKey: ['businesses'],
    queryFn: () => Business.list('-created_date'),
  });

  const { data: projects = [] } = useQuery({
    queryKey: ['projects'],
    queryFn: () => Project.list(),
  });

  const createMutation = useMutation({
    mutationFn: (data) => Business.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['businesses'] });
      closeForm();
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => Business.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['businesses'] });
      closeForm();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => Business.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['businesses'] });
    },
  });

  const openForm = (organization = null) => {
    if (organization) {
      setEditingOrganization(organization);
      setFormData({
        name: organization.name || '',
        industry: organization.industry || '',
        brand_colors: organization.brand_colors || '',
        status: organization.status || 'Active'
      });
    } else {
      setEditingOrganization(null);
      setFormData({ name: '', industry: '', brand_colors: '', status: 'Active' });
    }
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingOrganization(null);
    setFormData({ name: '', industry: '', brand_colors: '', status: 'Active' });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingOrganization) {
      updateMutation.mutate({ id: editingOrganization.id, data: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  const getProjectCount = (organizationId) => {
    return projects.filter(p => p.business_id === organizationId).length;
  };

  const getActiveProjectCount = (organizationId) => {
    return projects.filter(p => p.business_id === organizationId && !['Done', 'Published'].includes(p.status)).length;
  };

  const filteredOrganizations = organizations.filter(org =>
    org.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    org.industry?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">Organisaties</h1>
          <p className="text-gray-500 mt-1">{organizations.length} {organizations.length === 1 ? 'organisatie' : 'organisaties'}</p>
        </div>
        <Button 
          onClick={() => openForm()}
          className="bg-purple-600 hover:bg-purple-700 text-white gap-2"
        >
          <Plus className="w-4 h-4" />
          Nieuwe Organisatie
        </Button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <Input
          placeholder="Zoek organisaties..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10 bg-white"
        />
      </div>

      {/* Organization Cards */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {[1, 2, 3].map(i => (
            <Skeleton key={i} className="h-48 bg-gray-200" />
          ))}
        </div>
      ) : filteredOrganizations.length === 0 ? (
        <div className="bg-white rounded-xl p-12 text-center border border-gray-200">
          <Building2 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500 mb-4">
            {searchQuery ? 'Geen organisaties gevonden' : 'Nog geen organisaties toegevoegd'}
          </p>
          {!searchQuery && (
            <Button onClick={() => openForm()} className="bg-purple-600 hover:bg-purple-700">
              Voeg je eerste organisatie toe
            </Button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filteredOrganizations.map(organization => (
            <div 
              key={organization.id}
              className="bg-white rounded-xl p-6 border border-gray-200 hover:border-purple-300 hover:shadow-md transition-all group"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center">
                    {organization.logo ? (
                      <img src={organization.logo} alt={organization.name} className="w-8 h-8 rounded-lg object-cover" />
                    ) : (
                      <Building2 className="w-6 h-6 text-purple-600" />
                    )}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{organization.name}</h3>
                    <Badge 
                      variant="outline" 
                      className={organization.status === 'Active' 
                        ? 'border-green-500/30 text-green-700 bg-green-50 mt-1'
                        : 'border-gray-300 text-gray-500 bg-gray-50 mt-1'
                      }
                    >
                      {organization.status}
                    </Badge>
                  </div>
                </div>
                
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => openForm(organization)} 
                    className="h-8 w-8 text-gray-400 hover:text-gray-900"
                  >
                    <Edit2 className="w-4 h-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => {
                      if (confirm(`Weet je zeker dat je "${organization.name}" wilt verwijderen?`)) {
                        deleteMutation.mutate(organization.id);
                      }
                    }}
                    className="h-8 w-8 text-gray-400 hover:text-red-600"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {organization.industry && (
                <Badge className="bg-blue-50 text-blue-700 border-blue-200 mb-4">
                  {organization.industry}
                </Badge>
              )}

              <div className="space-y-2 mb-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Totaal projecten</span>
                  <span className="text-gray-900 font-medium">{getProjectCount(organization.id)}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Actieve projecten</span>
                  <span className="text-green-600 font-medium">{getActiveProjectCount(organization.id)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Form Dialog */}
      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{editingOrganization ? 'Organisatie Bewerken' : 'Nieuwe Organisatie'}</DialogTitle>
            <DialogDescription>
              {editingOrganization ? 'Wijzig de gegevens van deze organisatie' : 'Voeg een nieuwe organisatie toe aan je account'}
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label>Naam *</Label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Organisatienaam"
                required
              />
            </div>

            <div className="space-y-2">
              <Label>Industrie</Label>
              <Select 
                value={formData.industry} 
                onValueChange={(v) => setFormData(prev => ({ ...prev, industry: v }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecteer industrie" />
                </SelectTrigger>
                <SelectContent>
                  {INDUSTRIES.map(i => (
                    <SelectItem key={i} value={i}>{i}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Huisstijl Kleuren</Label>
              <Input
                value={formData.brand_colors}
                onChange={(e) => setFormData(prev => ({ ...prev, brand_colors: e.target.value }))}
                placeholder="#FF5733, #3498DB"
              />
            </div>

            <div className="space-y-2">
              <Label>Status</Label>
              <Select 
                value={formData.status} 
                onValueChange={(v) => setFormData(prev => ({ ...prev, status: v }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="Inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <Button type="button" variant="outline" onClick={closeForm}>
                Annuleren
              </Button>
              <Button type="submit" className="bg-purple-600 hover:bg-purple-700">
                {editingOrganization ? 'Opslaan' : 'Toevoegen'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

