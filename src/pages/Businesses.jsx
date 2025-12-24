import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Business, Project } from '@/api/entities';
import { Plus, Briefcase, Edit2, Trash2, Building2, FolderKanban } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from 'react-router-dom';
import { createPageUrl } from '../utils';

const INDUSTRIES = ['Fintech', 'Media', 'SaaS', 'E-commerce', 'Other'];

export default function Businesses() {
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [editingBusiness, setEditingBusiness] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    industry: '',
    brand_colors: '',
    status: 'Active'
  });

  const { data: businesses = [], isLoading } = useQuery({
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
      toast.success('Business succesvol verwijderd');
    },
  });

  const openForm = (business = null) => {
    if (business) {
      setEditingBusiness(business);
      setFormData({
        name: business.name || '',
        industry: business.industry || '',
        brand_colors: business.brand_colors || '',
        status: business.status || 'Active'
      });
    } else {
      setEditingBusiness(null);
      setFormData({ name: '', industry: '', brand_colors: '', status: 'Active' });
    }
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingBusiness(null);
    setFormData({ name: '', industry: '', brand_colors: '', status: 'Active' });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingBusiness) {
      updateMutation.mutate({ id: editingBusiness.id, data: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  const getProjectCount = (businessId) => {
    return projects.filter(p => p.business_id === businessId).length;
  };

  const getActiveProjectCount = (businessId) => {
    return projects.filter(p => p.business_id === businessId && !['Done', 'Published'].includes(p.status)).length;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-white">Mijn Businesses</h1>
          <p className="text-gray-500 mt-1">{businesses.length} businesses</p>
        </div>
        <Button 
          onClick={() => openForm()}
          className="bg-emerald-500 hover:bg-emerald-600 text-white gap-2"
        >
          <Plus className="w-4 h-4" />
          Nieuwe Business
        </Button>
      </div>

      {/* Business Cards */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {[1, 2, 3].map(i => (
            <Skeleton key={i} className="h-48 bg-[#22262b]" />
          ))}
        </div>
      ) : businesses.length === 0 ? (
        <div className="bg-[#22262b] rounded-2xl p-12 text-center border border-gray-800/50">
          <Briefcase className="w-12 h-12 text-gray-600 mx-auto mb-4" />
          <p className="text-gray-400 mb-4">Nog geen businesses toegevoegd</p>
          <Button onClick={() => openForm()} className="bg-emerald-500 hover:bg-emerald-600">
            Voeg je eerste business toe
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {businesses.map(business => (
            <div 
              key={business.id}
              className="bg-[#22262b] rounded-2xl p-6 border border-gray-800/50 hover:border-gray-700/50 transition-all group"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center">
                    {business.logo ? (
                      <img src={business.logo} alt={business.name} className="w-8 h-8 rounded-lg object-cover" />
                    ) : (
                      <Building2 className="w-6 h-6 text-purple-400" />
                    )}
                  </div>
                  <div>
                    <h3 className="font-semibold text-white">{business.name}</h3>
                    <Badge 
                      variant="outline" 
                      className={business.status === 'Active' 
                        ? 'border-emerald-500/30 text-emerald-400 bg-emerald-500/10'
                        : 'border-gray-500/30 text-gray-400 bg-gray-500/10'
                      }
                    >
                      {business.status}
                    </Badge>
                  </div>
                </div>
                
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button variant="ghost" size="icon" onClick={() => openForm(business)} className="h-8 w-8 text-gray-400 hover:text-white">
                    <Edit2 className="w-4 h-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => deleteMutation.mutate(business.id)}
                    className="h-8 w-8 text-gray-400 hover:text-red-400"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {business.industry && (
                <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30 mb-4">
                  {business.industry}
                </Badge>
              )}

              <div className="space-y-2 mb-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Totaal projecten</span>
                  <span className="text-white font-medium">{getProjectCount(business.id)}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Actieve projecten</span>
                  <span className="text-emerald-400 font-medium">{getActiveProjectCount(business.id)}</span>
                </div>
              </div>

              <Link 
                to={createPageUrl(`Projects?business=${business.id}`)}
                className="flex items-center gap-2 text-sm text-emerald-400 hover:text-emerald-300"
              >
                <FolderKanban className="w-4 h-4" />
                Bekijk projecten
              </Link>
            </div>
          ))}
        </div>
      )}

      {/* Form Dialog */}
      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="bg-[#22262b] border-gray-700 text-white max-w-md">
          <DialogHeader>
            <DialogTitle>{editingBusiness ? 'Business Bewerken' : 'Nieuwe Business'}</DialogTitle>
          </DialogHeader>
          
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label>Naam *</Label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                className="bg-[#1a1d21] border-gray-700"
                placeholder="Bedrijfsnaam"
                required
              />
            </div>

            <div className="space-y-2">
              <Label>Industrie</Label>
              <Select 
                value={formData.industry} 
                onValueChange={(v) => setFormData(prev => ({ ...prev, industry: v }))}
              >
                <SelectTrigger className="bg-[#1a1d21] border-gray-700">
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
                className="bg-[#1a1d21] border-gray-700"
                placeholder="#FF5733, #3498DB"
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
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="Inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <Button type="button" variant="outline" onClick={closeForm} className="border-gray-600 text-gray-300">
                Annuleren
              </Button>
              <Button type="submit" className="bg-emerald-500 hover:bg-emerald-600">
                {editingBusiness ? 'Opslaan' : 'Toevoegen'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}