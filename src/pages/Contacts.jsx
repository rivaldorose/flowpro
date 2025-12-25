import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { Plus, User, Mail, Phone, Building2, Edit2, Trash2, Search, Link2, Unlink } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Business } from '@/api/entities';

export default function Contacts() {
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [editingContact, setEditingContact] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    organization_id: '',
    role: '',
    notes: ''
  });

  // Load contacts
  const { data: contacts = [], isLoading } = useQuery({
    queryKey: ['contacts'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('contacts')
        .select('*, organizations:business_id(*)')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data || [];
    },
  });

  // Load organizations
  const { data: organizations = [] } = useQuery({
    queryKey: ['businesses'],
    queryFn: () => Business.list(),
  });

  const createMutation = useMutation({
    mutationFn: async (data) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data: result, error } = await supabase
        .from('contacts')
        .insert({
          ...data,
          created_by: user.id,
        })
        .select()
        .single();
      
      if (error) throw error;
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contacts'] });
      closeForm();
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }) => {
      const { data: result, error } = await supabase
        .from('contacts')
        .update(data)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contacts'] });
      closeForm();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      const { error } = await supabase
        .from('contacts')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contacts'] });
    },
  });

  const unlinkOrganizationMutation = useMutation({
    mutationFn: async (id) => {
      const { error } = await supabase
        .from('contacts')
        .update({ business_id: null })
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contacts'] });
    },
  });

  const openForm = (contact = null) => {
    if (contact) {
      setEditingContact(contact);
      setFormData({
        name: contact.name || '',
        email: contact.email || '',
        phone: contact.phone || '',
        organization_id: contact.business_id || '',
        role: contact.role || '',
        notes: contact.notes || ''
      });
    } else {
      setEditingContact(null);
      setFormData({ name: '', email: '', phone: '', organization_id: '', role: '', notes: '' });
    }
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingContact(null);
    setFormData({ name: '', email: '', phone: '', organization_id: '', role: '', notes: '' });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const submitData = {
      name: formData.name,
      email: formData.email || null,
      phone: formData.phone || null,
      business_id: formData.organization_id || null,
      role: formData.role || null,
      notes: formData.notes || null,
    };

    if (editingContact) {
      updateMutation.mutate({ id: editingContact.id, data: submitData });
    } else {
      createMutation.mutate(submitData);
    }
  };

  const filteredContacts = contacts.filter(contact =>
    contact.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    contact.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    contact.phone?.includes(searchQuery)
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">Contacten</h1>
          <p className="text-gray-500 mt-1">{contacts.length} {contacts.length === 1 ? 'contact' : 'contacten'}</p>
        </div>
        <Button 
          onClick={() => openForm()}
          className="bg-purple-600 hover:bg-purple-700 text-white gap-2"
        >
          <Plus className="w-4 h-4" />
          Nieuw Contact
        </Button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <Input
          placeholder="Zoek contacten..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10 bg-white"
        />
      </div>

      {/* Contacts List */}
      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map(i => (
            <Skeleton key={i} className="h-20 bg-gray-200" />
          ))}
        </div>
      ) : filteredContacts.length === 0 ? (
        <div className="bg-white rounded-xl p-12 text-center border border-gray-200">
          <User className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500 mb-4">
            {searchQuery ? 'Geen contacten gevonden' : 'Nog geen contacten toegevoegd'}
          </p>
          {!searchQuery && (
            <Button onClick={() => openForm()} className="bg-purple-600 hover:bg-purple-700">
              Voeg je eerste contact toe
            </Button>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {filteredContacts.map(contact => {
            const organization = contact.organizations || (contact.business_id && organizations.find(o => o.id === contact.business_id));
            
            return (
              <div 
                key={contact.id}
                className="bg-white rounded-xl p-5 border border-gray-200 hover:border-purple-300 hover:shadow-md transition-all group"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4 flex-1">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center flex-shrink-0">
                      <User className="w-6 h-6 text-purple-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-gray-900">{contact.name}</h3>
                        {contact.role && (
                          <Badge variant="outline" className="text-xs">
                            {contact.role}
                          </Badge>
                        )}
                      </div>
                      <div className="space-y-1 text-sm text-gray-600">
                        {contact.email && (
                          <div className="flex items-center gap-2">
                            <Mail className="w-3.5 h-3.5" />
                            <span>{contact.email}</span>
                          </div>
                        )}
                        {contact.phone && (
                          <div className="flex items-center gap-2">
                            <Phone className="w-3.5 h-3.5" />
                            <span>{contact.phone}</span>
                          </div>
                        )}
                        {organization && (
                          <div className="flex items-center gap-2 mt-2">
                            <Building2 className="w-3.5 h-3.5 text-purple-600" />
                            <span className="text-purple-600 font-medium">{organization.name}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    {contact.business_id && (
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => unlinkOrganizationMutation.mutate(contact.id)}
                        className="h-8 w-8 text-gray-400 hover:text-orange-600"
                        title="Koppeling met organisatie verwijderen"
                      >
                        <Unlink className="w-4 h-4" />
                      </Button>
                    )}
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => openForm(contact)} 
                      className="h-8 w-8 text-gray-400 hover:text-gray-900"
                    >
                      <Edit2 className="w-4 h-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => {
                        if (confirm(`Weet je zeker dat je "${contact.name}" wilt verwijderen?`)) {
                          deleteMutation.mutate(contact.id);
                        }
                      }}
                      className="h-8 w-8 text-gray-400 hover:text-red-600"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Form Dialog */}
      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingContact ? 'Contact Bewerken' : 'Nieuw Contact'}</DialogTitle>
            <DialogDescription>
              {editingContact ? 'Wijzig de gegevens van dit contact' : 'Voeg een nieuw contact toe'}
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label>Naam *</Label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Volledige naam"
                required
              />
            </div>

            <div className="space-y-2">
              <Label>E-mail</Label>
              <Input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                placeholder="email@voorbeeld.nl"
              />
            </div>

            <div className="space-y-2">
              <Label>Telefoon</Label>
              <Input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                placeholder="+31 6 12345678"
              />
            </div>

            <div className="space-y-2">
              <Label>Organisatie</Label>
              <Select 
                value={formData.organization_id} 
                onValueChange={(v) => setFormData(prev => ({ ...prev, organization_id: v }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Geen organisatie (optioneel)" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Geen organisatie</SelectItem>
                  {organizations.map(org => (
                    <SelectItem key={org.id} value={org.id}>{org.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Functie/Rol</Label>
              <Input
                value={formData.role}
                onChange={(e) => setFormData(prev => ({ ...prev, role: e.target.value }))}
                placeholder="bijv. Producer, Director, etc."
              />
            </div>

            <div className="space-y-2">
              <Label>Notities</Label>
              <textarea
                value={formData.notes}
                onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                placeholder="Extra informatie over dit contact..."
                className="w-full min-h-[80px] px-3 py-2 text-sm border border-gray-300 rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <Button type="button" variant="outline" onClick={closeForm}>
                Annuleren
              </Button>
              <Button type="submit" className="bg-purple-600 hover:bg-purple-700">
                {editingContact ? 'Opslaan' : 'Toevoegen'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

