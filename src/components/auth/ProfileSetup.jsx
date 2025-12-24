import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { User } from '@/api/entities';
import { UploadFile } from '@/api/integrations';
import { supabase } from '@/lib/supabase';

/**
 * Profile Setup - Mandatory profile creation page
 * Users must complete their profile before accessing the app
 * Uses the same design as SignIn/SignUp pages
 */
export default function ProfileSetup() {
  const queryClient = useQueryClient();
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    full_name: '',
    job_title: '',
    photo: ''
  });

  const updateMutation = useMutation({
    mutationFn: async (data) => {
      // #region agent log
      fetch('http://127.0.0.1:7244/ingest/0a454eb1-d3d1-4c43-8c8e-e087d82e49ee',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'ProfileSetup.jsx:25',message:'Starting profile update',data:{hasData:!!data,fullName:data?.full_name},timestamp:Date.now(),sessionId:'debug-session',runId:'pre-fix',hypothesisId:'A'})}).catch(()=>{});
      // #endregion

      // Check session first
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
      // #region agent log
      fetch('http://127.0.0.1:7244/ingest/0a454eb1-d3d1-4c43-8c8e-e087d82e49ee',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'ProfileSetup.jsx:30',message:'Session check result',data:{hasSession:!!sessionData?.session,hasError:!!sessionError,sessionError:sessionError?.message},timestamp:Date.now(),sessionId:'debug-session',runId:'pre-fix',hypothesisId:'B'})}).catch(()=>{});
      // #endregion

      // Get current user
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      // #region agent log
      fetch('http://127.0.0.1:7244/ingest/0a454eb1-d3d1-4c43-8c8e-e087d82e49ee',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'ProfileSetup.jsx:35',message:'GetUser result',data:{hasUser:!!user,userId:user?.id,hasError:!!userError,userError:userError?.message},timestamp:Date.now(),sessionId:'debug-session',runId:'pre-fix',hypothesisId:'C'})}).catch(()=>{});
      // #endregion

      if (userError) {
        console.error('Auth error:', userError);
        throw new Error('Authenticatie fout: ' + userError.message);
      }
      if (!user) {
        throw new Error('Je bent niet ingelogd. Log opnieuw in.');
      }

      // #region agent log
      fetch('http://127.0.0.1:7244/ingest/0a454eb1-d3d1-4c43-8c8e-e087d82e49ee',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'ProfileSetup.jsx:45',message:'Before checking existing profile',data:{userId:user.id},timestamp:Date.now(),sessionId:'debug-session',runId:'pre-fix',hypothesisId:'D'})}).catch(()=>{});
      // #endregion

      // Check if profile exists (don't throw error if not found, that's ok)
      const { data: existingProfile, error: checkError } = await supabase
        .from('users')
        .select('id')
        .eq('id', user.id)
        .single();
      
      // #region agent log
      fetch('http://127.0.0.1:7244/ingest/0a454eb1-d3d1-4c43-8c8e-e087d82e49ee',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'ProfileSetup.jsx:54',message:'Profile check result',data:{profileExists:!!existingProfile,hasError:!!checkError,errorCode:checkError?.code,errorMessage:checkError?.message},timestamp:Date.now(),sessionId:'debug-session',runId:'pre-fix',hypothesisId:'E'})}).catch(()=>{});
      // #endregion
      
      // Ignore "not found" errors - that's expected for new users
      const profileExists = existingProfile && !checkError;

      const userData = {
        id: user.id,
        email: user.email,
        full_name: data.full_name,
        avatar_url: data.photo || null,
        ...(data.job_title && { job_title: data.job_title })
      };

      let profile;
      if (profileExists) {
        // Update existing
        const { data: updated, error: updateError } = await supabase
          .from('users')
          .update({
            full_name: data.full_name,
            avatar_url: data.photo || null,
            ...(data.job_title && { job_title: data.job_title })
          })
          .eq('id', user.id)
          .select()
          .single();
        
        if (updateError) {
          console.error('Update error:', updateError);
          throw new Error(updateError.message || 'Kon profiel niet bijwerken');
        }
        profile = updated;
      } else {
        // #region agent log
        fetch('http://127.0.0.1:7244/ingest/0a454eb1-d3d1-4c43-8c8e-e087d82e49ee',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'ProfileSetup.jsx:75',message:'Attempting to create profile',data:{userDataKeys:Object.keys(userData)},timestamp:Date.now(),sessionId:'debug-session',runId:'pre-fix',hypothesisId:'F'})}).catch(()=>{});
        // #endregion

        // Create new
        const { data: created, error: createError } = await supabase
          .from('users')
          .insert(userData)
          .select()
          .single();
        
        // #region agent log
        fetch('http://127.0.0.1:7244/ingest/0a454eb1-d3d1-4c43-8c8e-e087d82e49ee',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'ProfileSetup.jsx:84',message:'Profile create result',data:{created:!!created,hasError:!!createError,errorCode:createError?.code,errorMessage:createError?.message,errorDetails:createError?.details},timestamp:Date.now(),sessionId:'debug-session',runId:'pre-fix',hypothesisId:'G'})}).catch(()=>{});
        // #endregion
        
        if (createError) {
          console.error('Create error:', createError);
          throw new Error(createError.message || 'Kon profiel niet aanmaken');
        }
        profile = created;
      }

      // Update auth metadata (non-blocking)
      supabase.auth.updateUser({
        data: {
          full_name: data.full_name,
          avatar_url: data.photo
        }
      }).catch(err => console.warn('Auth metadata update failed:', err));

      return profile;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUser'] });
      queryClient.invalidateQueries({ queryKey: ['userProfile'] });
      // Redirect to dashboard
      window.location.href = '/dashboard';
    },
    onError: (error) => {
      console.error('Profile update error:', error);
      const errorMessage = error.message || error.toString() || 'Kon profiel niet opslaan. Probeer het opnieuw.';
      setError(errorMessage);
      setLoading(false);
    },
  });

  const handlePhotoUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const { file_url } = await UploadFile({ file });
      setFormData(prev => ({ ...prev, photo: file_url }));
    } catch (error) {
      setError('Kon foto niet uploaden');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!formData.full_name.trim()) {
      setError('Volledige naam is verplicht');
      return;
    }

    setLoading(true);
    updateMutation.mutate(formData);
  };

  return (
    <div className="min-h-screen bg-[#FAFAF9] font-sans selection:bg-[#6B46C1] selection:text-white flex overflow-hidden">
      {/* LEFT SIDE: VISUAL (Hidden on mobile) */}
      <div className="hidden lg:flex w-1/2 relative bg-gradient-to-br from-[#6B46C1] via-[#805AD5] to-[#F97316] items-center justify-center overflow-hidden">
        {/* Texture Overlay */}
        <div 
          className="absolute inset-0 mix-blend-overlay opacity-40 pointer-events-none"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.08'/%3E%3C/svg%3E")`
          }}
        />

        {/* Decorative Light Leak */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#F97316] blur-[120px] opacity-20 rounded-full translate-x-1/3 -translate-y-1/3"></div>
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-[#6B46C1] blur-[100px] opacity-30 rounded-full -translate-x-1/3 translate-y-1/3"></div>

        {/* Content */}
        <div className="relative z-10 max-w-lg px-12 text-center animate-fade-in">
          <div className="w-20 h-20 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl flex items-center justify-center mx-auto mb-8 shadow-2xl rotate-3 hover:rotate-6 transition-transform duration-500">
            <svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" role="img" width="40" height="40" viewBox="0 0 24 24" className="text-white">
              <path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 1 1-8 0a4 4 0 0 1 8 0M12 14a7 7 0 0 0-7 7h14a7 7 0 0 0-7-7Z"></path>
            </svg>
          </div>

          <h1 className="font-serif italic text-5xl text-white mb-6 leading-tight tracking-tight drop-shadow-sm">
            Complete your <br />profile.
          </h1>
          <p className="text-white/80 text-lg">Set up your account to get started.</p>
        </div>

        {/* Copyright Bottom Left */}
        <div className="absolute bottom-8 left-8 text-white/40 text-xs font-medium tracking-wide">
          © 2024 FLOW PRO STUDIOS
        </div>
      </div>

      {/* RIGHT SIDE: FORM */}
      <div className="w-full lg:w-1/2 flex flex-col relative bg-white">
        {/* Mobile Header */}
        <div className="lg:hidden p-6 flex items-center gap-2">
          <div className="w-8 h-8 bg-[#6B46C1] rounded-lg flex items-center justify-center text-white">
            <svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" role="img" width="18" height="18" viewBox="0 0 24 24">
              <path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.2 6L3 11l-.9-2.4c-.3-1.1.3-2.2 1.3-2.5l13.5-4c1.1-.3 2.2.3 2.5 1.3Zm-14-.7l3.1 3.9m3.1-5.8l3.1 4M3 11h18v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2Z"></path>
            </svg>
          </div>
          <span className="font-serif font-bold text-xl text-[#1F2937]">Flow Pro</span>
        </div>

        {/* Main Form Container */}
        <div className="flex-1 flex items-center justify-center px-6 sm:px-12 lg:px-24">
          <div className="w-full max-w-[440px] animate-slide-up">
            {/* Header */}
            <div className="mb-10 text-center lg:text-left">
              <h2 className="font-serif font-bold text-3xl sm:text-4xl text-[#1F2937] tracking-tight mb-3">Create your profile</h2>
              <p className="text-[#78716C] text-[15px]">Complete your profile to continue to your dashboard.</p>
            </div>

            {/* Error Banner */}
            {error && (
              <div className="mb-6 p-3 bg-red-50 border-l-4 border-red-500 rounded-md flex items-start gap-3 animate-fade-in">
                <svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" role="img" width="18" height="18" viewBox="0 0 24 24" className="text-red-500 mt-0.5 shrink-0">
                  <g fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2">
                    <circle cx="12" cy="12" r="10"></circle>
                    <path d="M12 8v4m0 4h.01"></path>
                  </g>
                </svg>
                <div className="flex-1">
                  <h4 className="text-sm font-semibold text-red-800">Error</h4>
                  <p className="text-xs text-red-600 mt-0.5">{error}</p>
                </div>
                <button 
                  onClick={() => setError('')} 
                  className="ml-auto text-red-400 hover:text-red-600"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" role="img" width="16" height="16" viewBox="0 0 24 24">
                    <path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 6L6 18M6 6l12 12"></path>
                  </svg>
                </button>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5" noValidate>
              {/* Photo Upload */}
              <div className="flex justify-center mb-2">
                <div className="relative">
                  <div className="w-24 h-24 rounded-full overflow-hidden bg-gradient-to-br from-[#6B46C1] to-[#F97316] flex items-center justify-center border-4 border-white shadow-lg">
                    {formData.photo ? (
                      <img src={formData.photo} alt="Profile" className="w-full h-full object-cover" />
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" role="img" width="40" height="40" viewBox="0 0 24 24" className="text-white">
                        <path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 1 1-8 0a4 4 0 0 1 8 0M12 14a7 7 0 0 0-7 7h14a7 7 0 0 0-7-7Z"></path>
                      </svg>
                    )}
                  </div>
                  <label 
                    htmlFor="photo-upload-setup" 
                    className="absolute bottom-0 right-0 w-8 h-8 bg-[#6B46C1] hover:bg-[#5B3CA1] rounded-full flex items-center justify-center cursor-pointer transition-colors shadow-lg border-2 border-white"
                  >
                    {uploading ? (
                      <svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" role="img" width="16" height="16" viewBox="0 0 24 24" className="text-white animate-spin">
                        <path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 1 1-6.219-8.56"></path>
                      </svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" role="img" width="16" height="16" viewBox="0 0 24 24" className="text-white">
                        <path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12a9 9 0 1 0 18 0a9 9 0 0 0-18 0m9 0V3m0 9l4-4m-4 4l-4-4"></path>
                      </svg>
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
              <p className="text-center text-xs text-[#78716C] mb-4">Click to upload profile photo (optional)</p>

              {/* Full Name */}
              <div className="space-y-1.5">
                <label htmlFor="full_name" className="block text-sm font-medium text-[#1F2937]">Full Name *</label>
                <input
                  type="text"
                  id="full_name"
                  name="full_name"
                  required
                  value={formData.full_name}
                  onChange={(e) => setFormData(prev => ({ ...prev, full_name: e.target.value }))}
                  className="block w-full px-4 py-3 rounded-lg border border-gray-200 text-[#1F2937] placeholder-gray-400 focus:outline-none focus:border-[#6B46C1] focus:ring-1 focus:ring-[#6B46C1] transition-all sm:text-sm"
                  placeholder="John Doe"
                  autoFocus
                />
              </div>

              {/* Job Title */}
              <div className="space-y-1.5">
                <label htmlFor="job_title" className="block text-sm font-medium text-[#1F2937]">Job Title</label>
                <input
                  type="text"
                  id="job_title"
                  name="job_title"
                  value={formData.job_title}
                  onChange={(e) => setFormData(prev => ({ ...prev, job_title: e.target.value }))}
                  className="block w-full px-4 py-3 rounded-lg border border-gray-200 text-[#1F2937] placeholder-gray-400 focus:outline-none focus:border-[#6B46C1] focus:ring-1 focus:ring-[#6B46C1] transition-all sm:text-sm"
                  placeholder="Producer, Editor, Director..."
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading || !formData.full_name.trim()}
                className="w-full flex justify-center py-3.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-semibold text-white bg-[#6B46C1] hover:bg-[#5B3CA1] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#6B46C1] transition-all transform active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed mt-4"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" role="img" width="18" height="18" viewBox="0 0 24 24" className="animate-spin">
                      <path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 1 1-6.219-8.56"></path>
                    </svg>
                    Creating profile...
                  </span>
                ) : (
                  'Continue to Dashboard'
                )}
              </button>
            </form>

            {/* Footer Note */}
            <p className="mt-6 text-center text-xs text-[#78716C]">
              You can update your profile anytime in settings.
            </p>
          </div>
        </div>

        {/* Bottom Utils */}
        <div className="hidden lg:flex justify-between items-center px-12 py-6 text-xs text-[#78716C] border-t border-gray-100 bg-gray-50/50">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5">
              <svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" role="img" width="14" height="14" viewBox="0 0 24 24" className="text-[#14B8A6]">
                <g fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2">
                  <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"></path>
                  <path d="m9 12l2 2l4-4"></path>
                </g>
              </svg>
              Secure Profile
            </span>
          </div>
          <div className="flex gap-6">
            <a href="#" className="hover:text-[#1F2937] transition-colors">Privacy</a>
            <a href="#" className="hover:text-[#1F2937] transition-colors">Terms</a>
            <a href="#" className="hover:text-[#1F2937] transition-colors">Help</a>
          </div>
        </div>
      </div>
    </div>
  );
}
