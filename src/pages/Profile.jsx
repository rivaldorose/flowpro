import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { User } from '@/api/entities';
import { UploadFile } from '@/api/integrations';
import { User as UserIcon, Mail, Phone, Briefcase, Camera, Save, Loader2 } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";

export default function Profile() {
  const queryClient = useQueryClient();
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    full_name: '',
    phone: '',
    job_title: '',
    photo: ''
  });

  const { data: currentUser, isLoading } = useQuery({
    queryKey: ['currentUser'],
    queryFn: () => User.me(),
  });

  React.useEffect(() => {
    if (currentUser) {
      setFormData({
        full_name: currentUser.full_name || '',
        phone: currentUser.phone || '',
        job_title: currentUser.job_title || '',
        photo: currentUser.photo || ''
      });
    }
  }, [currentUser]);

  const updateMutation = useMutation({
    mutationFn: (data) => User.updateMe(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUser'] });
      toast.success('Profiel succesvol bijgewerkt');
    },
  });

  const handlePhotoUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const { file_url } = await UploadFile({ file });
      setFormData(prev => ({ ...prev, photo: file_url }));
      toast.success('Foto geüpload');
    } catch (error) {
      toast.error('Kon foto niet uploaden');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    updateMutation.mutate(formData);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-3xl mx-auto space-y-6">
          <Skeleton className="h-12 w-64 bg-white" />
          <Skeleton className="h-96 bg-white" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">Mijn Profiel</h1>
          <p className="text-gray-600 mt-1">Beheer je persoonlijke informatie</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Profile Card */}
          <div className="bg-white rounded-xl p-8 border border-gray-200 shadow-sm">
          {/* Photo Section */}
          <div className="flex flex-col md:flex-row items-start gap-8 mb-8">
            <div className="relative">
              <div className="w-32 h-32 rounded-full overflow-hidden bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                {formData.photo ? (
                  <img src={formData.photo} alt="Profiel" className="w-full h-full object-cover" />
                ) : (
                  <UserIcon className="w-16 h-16 text-white" />
                )}
              </div>
              <label htmlFor="photo-upload" className="absolute bottom-0 right-0 w-10 h-10 bg-emerald-500 hover:bg-emerald-600 rounded-full flex items-center justify-center cursor-pointer transition-colors">
                {uploading ? (
                  <Loader2 className="w-5 h-5 text-white animate-spin" />
                ) : (
                  <Camera className="w-5 h-5 text-white" />
                )}
              </label>
              <input
                id="photo-upload"
                type="file"
                accept="image/*"
                onChange={handlePhotoUpload}
                className="hidden"
                disabled={uploading}
              />
            </div>

            <div className="flex-1">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">{currentUser?.full_name}</h2>
              <div className="flex items-center gap-2 mb-4">
                <Badge variant="outline" className="border-emerald-500 text-emerald-700 bg-emerald-50">
                  {currentUser?.role === 'admin' ? 'Administrator' : 'Gebruiker'}
                </Badge>
              </div>
              <p className="text-gray-600 text-sm">
                Lid sinds {new Date(currentUser?.created_date).toLocaleDateString('nl-NL', { year: 'numeric', month: 'long' })}
              </p>
            </div>
          </div>

          {/* Form Fields */}
          <div className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-2">
                <Label className="text-gray-700">
                  <UserIcon className="w-4 h-4 inline mr-2" />
                  Volledige Naam *
                </Label>
                <Input
                  value={formData.full_name}
                  onChange={(e) => setFormData(prev => ({ ...prev, full_name: e.target.value }))}
                  className="bg-white border-gray-300"
                  placeholder="Jouw naam"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label className="text-gray-700">
                  <Mail className="w-4 h-4 inline mr-2" />
                  E-mailadres
                </Label>
                <Input
                  value={currentUser?.email}
                  className="bg-gray-50 border-gray-300 text-gray-500"
                  disabled
                />
                <p className="text-xs text-gray-500">E-mail kan niet worden gewijzigd</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-2">
                <Label className="text-gray-700">
                  <Phone className="w-4 h-4 inline mr-2" />
                  Telefoonnummer
                </Label>
                <Input
                  value={formData.phone}
                  onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                  className="bg-white border-gray-300"
                  placeholder="+31 6 1234 5678"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-gray-700">
                  <Briefcase className="w-4 h-4 inline mr-2" />
                  Functie
                </Label>
                <Input
                  value={formData.job_title}
                  onChange={(e) => setFormData(prev => ({ ...prev, job_title: e.target.value }))}
                  className="bg-white border-gray-300"
                  placeholder="Bijv. Producer, Editor"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end">
          <Button 
            type="submit" 
            disabled={updateMutation.isPending}
            className="bg-emerald-500 hover:bg-emerald-600 gap-2"
          >
            {updateMutation.isPending ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Opslaan...
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                Profiel Opslaan
              </>
            )}
          </Button>
        </div>
      </form>

      {/* Logout Section */}
      <div className="bg-white rounded-xl p-6 border border-red-200 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Uitloggen</h3>
        <p className="text-gray-600 text-sm mb-4">
          Je wordt uitgelogd en teruggestuurd naar het inlogscherm.
        </p>
        <Button 
          variant="outline" 
          onClick={() => User.signOut()}
          className="border-red-300 text-red-600 hover:bg-red-50"
        >
          Uitloggen
        </Button>
      </div>
    </div>
    </div>
  );
}