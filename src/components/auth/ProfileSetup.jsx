import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { User } from '@/api/entities';
import { UploadFile } from '@/api/integrations';
import { User as UserIcon, Mail, Camera, Save, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

/**
 * Profile Setup - Mandatory profile creation page
 * Users must complete their profile before accessing the app
 */
export default function ProfileSetup() {
  const queryClient = useQueryClient();
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    full_name: '',
    phone: '',
    job_title: '',
    photo: ''
  });

  const updateMutation = useMutation({
    mutationFn: (data) => User.updateMe(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUser'] });
      queryClient.invalidateQueries({ queryKey: ['userProfile'] });
      toast.success('Profiel succesvol aangemaakt');
      // Reload page to trigger profile check
      window.location.href = '/dashboard';
    },
    onError: (error) => {
      toast.error('Kon profiel niet opslaan: ' + (error.message || 'Onbekende fout'));
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
    if (!formData.full_name.trim()) {
      toast.error('Volledige naam is verplicht');
      return;
    }
    updateMutation.mutate(formData);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-pink-600 to-orange-600 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl p-8">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <UserIcon className="w-8 h-8 text-purple-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Welkom bij Flow Pro</h1>
          <p className="text-gray-600">Maak je profiel aan om te beginnen</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Photo Section */}
          <div className="flex justify-center">
            <div className="relative">
              <div className="w-24 h-24 rounded-full overflow-hidden bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                {formData.photo ? (
                  <img src={formData.photo} alt="Profiel" className="w-full h-full object-cover" />
                ) : (
                  <UserIcon className="w-12 h-12 text-white" />
                )}
              </div>
              <label htmlFor="photo-upload-setup" className="absolute bottom-0 right-0 w-8 h-8 bg-purple-600 hover:bg-purple-700 rounded-full flex items-center justify-center cursor-pointer transition-colors shadow-lg">
                {uploading ? (
                  <Loader2 className="w-4 h-4 text-white animate-spin" />
                ) : (
                  <Camera className="w-4 h-4 text-white" />
                )}
              </label>
              <input
                id="photo-upload-setup"
                type="file"
                accept="image/*"
                onChange={handlePhotoUpload}
                className="hidden"
                disabled={uploading}
              />
            </div>
          </div>

          {/* Form Fields */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="full_name" className="text-gray-700 font-medium">
                <UserIcon className="w-4 h-4 inline mr-2" />
                Volledige Naam *
              </Label>
              <Input
                id="full_name"
                value={formData.full_name}
                onChange={(e) => setFormData(prev => ({ ...prev, full_name: e.target.value }))}
                className="w-full"
                placeholder="Jouw naam"
                required
                autoFocus
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="job_title" className="text-gray-700 font-medium">
                Functie
              </Label>
              <Input
                id="job_title"
                value={formData.job_title}
                onChange={(e) => setFormData(prev => ({ ...prev, job_title: e.target.value }))}
                className="w-full"
                placeholder="Bijv. Producer, Editor, Director"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone" className="text-gray-700 font-medium">
                Telefoonnummer
              </Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                className="w-full"
                placeholder="+31 6 1234 5678"
              />
            </div>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={updateMutation.isPending || !formData.full_name.trim()}
            className="w-full bg-purple-600 hover:bg-purple-700 h-12 text-lg font-semibold"
          >
            {updateMutation.isPending ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Opslaan...
              </>
            ) : (
              <>
                <Save className="w-5 h-5 mr-2" />
                Profiel Aanmaken en Doorgaan
              </>
            )}
          </Button>

          <p className="text-xs text-center text-gray-500 mt-4">
            Je kunt deze gegevens later altijd aanpassen in je profielinstellingen.
          </p>
        </form>
      </div>
    </div>
  );
}

