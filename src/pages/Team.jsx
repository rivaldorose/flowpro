import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Users, Mail, UserPlus, Shield, User as UserIcon, Send } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export default function Team() {
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteName, setInviteName] = useState('');
  const [sending, setSending] = useState(false);

  const { data: users = [], isLoading } = useQuery({
    queryKey: ['users'],
    queryFn: () => base44.entities.User.list(),
  });

  const { data: currentUser } = useQuery({
    queryKey: ['currentUser'],
    queryFn: () => base44.auth.me(),
  });

  const isAdmin = currentUser?.role === 'admin';

  const handleInvite = async (e) => {
    e.preventDefault();
    if (!inviteEmail) return;

    setSending(true);
    try {
      const appUrl = window.location.origin;
      
      await base44.integrations.Core.SendEmail({
        to: inviteEmail,
        subject: 'Uitnodiging voor FlowPro',
        body: `
Hoi ${inviteName || 'daar'},

Je bent uitgenodigd om FlowPro te gebruiken door ${currentUser?.full_name || 'een teamlid'}.

FlowPro is onze productie management app voor video projecten.

Klik op de onderstaande link om in te loggen of een account aan te maken:
${appUrl}

Tot snel!
        `
      });

      toast.success(`Uitnodiging verstuurd naar ${inviteEmail}`);
      setInviteEmail('');
      setInviteName('');
    } catch (error) {
      toast.error('Kon uitnodiging niet versturen');
      console.error(error);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-white">Team</h1>
          <p className="text-gray-500 mt-1">{users.length} teamleden</p>
        </div>
      </div>

      {/* Invite Section */}
      {isAdmin && (
        <div className="bg-gradient-to-br from-emerald-500/10 to-blue-500/10 rounded-2xl p-6 border border-emerald-500/20">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/20 flex items-center justify-center flex-shrink-0">
              <UserPlus className="w-6 h-6 text-emerald-400" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-white mb-3">Nodig teamleden uit</h3>
              <form onSubmit={handleInvite} className="space-y-3">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <Label className="text-gray-300 text-sm">E-mailadres *</Label>
                    <Input
                      type="email"
                      value={inviteEmail}
                      onChange={(e) => setInviteEmail(e.target.value)}
                      placeholder="naam@bedrijf.nl"
                      className="bg-[#1a1d21] border-gray-700 text-white"
                      required
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-gray-300 text-sm">Naam (optioneel)</Label>
                    <Input
                      value={inviteName}
                      onChange={(e) => setInviteName(e.target.value)}
                      placeholder="Voornaam"
                      className="bg-[#1a1d21] border-gray-700 text-white"
                    />
                  </div>
                </div>
                <Button 
                  type="submit"
                  disabled={sending}
                  className="bg-emerald-500 hover:bg-emerald-600 gap-2"
                >
                  <Send className="w-4 h-4" />
                  {sending ? 'Versturen...' : 'Uitnodiging Versturen'}
                </Button>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Team Members */}
      <div className="bg-[#22262b] rounded-2xl p-6 border border-gray-800/50">
        <h3 className="text-lg font-semibold text-white mb-4">Teamleden</h3>
        
        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3].map(i => (
              <Skeleton key={i} className="h-20 bg-[#1a1d21]" />
            ))}
          </div>
        ) : users.length === 0 ? (
          <div className="text-center py-12">
            <Users className="w-12 h-12 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400">Nog geen teamleden</p>
          </div>
        ) : (
          <div className="space-y-3">
            {users.map(user => (
              <div 
                key={user.id}
                className="flex items-center justify-between p-4 bg-[#1a1d21] rounded-xl border border-gray-700/50 hover:border-gray-600/50 transition-all"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-emerald-500 to-blue-500 flex items-center justify-center">
                    <span className="text-white font-semibold text-lg">
                      {user.full_name?.charAt(0).toUpperCase() || user.email?.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-semibold text-white">{user.full_name || 'Geen naam'}</h4>
                      {user.id === currentUser?.id && (
                        <Badge variant="outline" className="border-emerald-500/30 text-emerald-400 text-xs">
                          Jij
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-gray-400 flex items-center gap-1">
                      <Mail className="w-3 h-3" />
                      {user.email}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {user.role === 'admin' ? (
                    <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30" variant="outline">
                      <Shield className="w-3 h-3 mr-1" />
                      Admin
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="border-gray-600 text-gray-400">
                      <UserIcon className="w-3 h-3 mr-1" />
                      Gebruiker
                    </Badge>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Info Section */}
      <div className="bg-[#22262b] rounded-xl p-4 border border-gray-800/50">
        <p className="text-sm text-gray-400">
          💡 <strong className="text-white">Tip:</strong> Admins kunnen teamleden uitnodigen via het Base44 dashboard. 
          Gebruikers kunnen hun eigen profiel bewerken maar geen andere teamleden beheren.
        </p>
      </div>
    </div>
  );
}