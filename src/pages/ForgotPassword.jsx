import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [emailValid, setEmailValid] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [step, setStep] = useState(1); // 1 = request, 2 = confirmation
  const [resendCountdown, setResendCountdown] = useState(0);

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  useEffect(() => {
    // Auto focus on email input
    const emailInput = document.getElementById('email');
    if (emailInput) {
      setTimeout(() => emailInput.focus(), 100);
    }
  }, []);

  const validateEmail = (value) => {
    setEmail(value);
    const isValid = emailRegex.test(value);
    setEmailValid(isValid);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address.');
      return;
    }

    setLoading(true);

    try {
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (resetError) {
        setError(resetError.message || 'Unable to send reset email. Please try again.');
        return;
      }

      // Success - transition to step 2
      setStep(2);
    } catch (err) {
      setError(err.message || 'An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (resendCountdown > 0) return;

    setResendCountdown(30);
    setLoading(true);

    try {
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (resetError) {
        setError(resetError.message || 'Unable to resend email. Please try again.');
        setLoading(false);
        return;
      }

      // Start countdown
      const timer = setInterval(() => {
        setResendCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            setLoading(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } catch (err) {
      setError(err.message || 'An unexpected error occurred. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAFAF9] font-sans selection:bg-[#6B46C1] selection:text-white flex flex-col relative overflow-hidden">
      {/* Background Texture */}
      <div
        className="absolute inset-0 opacity-50 z-0 mix-blend-multiply pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.08'/%3E%3C/svg%3E")`
        }}
      />

      {/* Decorative Background Gradients */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-[#6B46C1]/5 rounded-full blur-[100px] z-0"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-[#F97316]/5 rounded-full blur-[100px] z-0"></div>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 relative z-10">
        {/* Logo (Top Center) */}
        <div className="absolute top-6 sm:top-8 left-0 right-0 flex justify-center">
          <a href="/" className="flex items-center gap-2 group transition-opacity hover:opacity-80">
            <div className="w-8 h-8 bg-[#6B46C1] rounded-lg flex items-center justify-center text-white shadow-md">
              <svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" role="img" width="18" height="18" viewBox="0 0 24 24" className="text-white">
                <path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.2 6L3 11l-.9-2.4c-.3-1.1.3-2.2 1.3-2.5l13.5-4c1.1-.3 2.2.3 2.5 1.3Zm-14-.7l3.1 3.9m3.1-5.8l3.1 4M3 11h18v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2Z"></path>
              </svg>
            </div>
            <span className="font-serif font-bold text-xl text-[#1F2937] tracking-tight">Flow Pro</span>
          </a>
        </div>

        {/* Card Container */}
        <div className="w-full max-w-[480px] bg-white rounded-2xl shadow-[0_4px_24px_rgba(0,0,0,0.08)] border border-white/50 animate-slide-up overflow-hidden relative">
          {/* Top Gradient Bar */}
          <div className="h-1 w-full bg-gradient-to-r from-[#6B46C1] via-[#805AD5] to-[#F97316]"></div>

          <div className="p-8 sm:p-12">
            {/* STEP 1: REQUEST RESET */}
            <div
              id="step-1"
              className={`transition-all duration-300 ease-in-out ${step === 1 ? 'block' : 'hidden opacity-0'}`}
            >
              {/* Icon */}
              <div className="w-16 h-16 mx-auto bg-[#FAFAF9] rounded-full flex items-center justify-center mb-6 text-[#78716C] border border-[#E5E7EB]">
                <svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" role="img" width="32" height="32" viewBox="0 0 24 24" className="text-[#78716C]">
                  <path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M2 18v3c0 .6.4 1 1 1h4v-3h3v-3h2l1.4-1.4a6.5 6.5 0 1 0-4-4Z"></path>
                  <circle cx="16.5" cy="7.5" r=".5" fill="currentColor"></circle>
                </svg>
              </div>

              {/* Header */}
              <div className="text-center mb-8">
                <h1 className="font-serif font-bold text-3xl text-[#1F2937] tracking-tight mb-3">Forgot your password?</h1>
                <p className="text-[#78716C] text-[15px] max-w-xs mx-auto leading-relaxed">
                  No worries! Enter your email and we'll send you reset instructions.
                </p>
              </div>

              {/* Error Banner */}
              {error && (
                <div className="mb-6 p-3 bg-red-50 border-l-4 border-red-500 rounded-r-md flex items-start gap-3 animate-shake">
                  <svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" role="img" width="18" height="18" viewBox="0 0 24 24" className="text-red-500 mt-0.5 shrink-0">
                    <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeWidth="2"></circle>
                    <path fill="none" stroke="currentColor" strokeWidth="2" d="M12 8v4m0 4h.01"></path>
                  </svg>
                  <div className="flex-1">
                    <h4 className="text-sm font-semibold text-red-800">Email not found</h4>
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
              <form onSubmit={handleSubmit} className="space-y-6" noValidate>
                <div className="space-y-1.5 relative">
                  <label htmlFor="email" className="block text-sm font-medium text-[#1F2937]">Email address</label>
                  <div className="relative group">
                    <input
                      type="email"
                      id="email"
                      name="email"
                      autoComplete="email"
                      required
                      value={email}
                      onChange={(e) => validateEmail(e.target.value)}
                      className={`block w-full px-4 h-[52px] rounded-lg border text-[#1F2937] placeholder-gray-400 focus:outline-none focus:ring-1 transition-all text-base shadow-sm ${
                        emailValid && email
                          ? 'border-emerald-500 focus:border-emerald-500 focus:ring-emerald-500'
                          : 'border-[#E5E7EB] focus:border-[#6B46C1] focus:ring-[#6B46C1]'
                      } ${error ? 'border-red-500 ring-1 ring-red-500' : ''}`}
                      placeholder="name@production.com"
                      disabled={loading}
                    />

                    {/* Valid Indicator */}
                    {emailValid && email && (
                      <div className="absolute right-4 top-1/2 -translate-y-1/2 text-emerald-500 animate-scale-in">
                        <svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" role="img" width="20" height="20" viewBox="0 0 24 24" className="text-emerald-500">
                          <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeWidth="2"></circle>
                          <path fill="none" stroke="currentColor" strokeWidth="2" d="m9 12l2 2l4-4"></path>
                        </svg>
                      </div>
                    )}
                  </div>
                  {error && email && !emailRegex.test(email) && (
                    <p className="text-xs text-red-500 mt-1">Please enter a valid email address.</p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full h-[52px] flex items-center justify-center rounded-lg shadow-sm text-base font-semibold text-white bg-[#6B46C1] hover:bg-[#5B3CA1] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#6B46C1] transition-all transform active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" role="img" width="18" height="18" viewBox="0 0 24 24" className="animate-spin">
                        <path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 1 1-6.219-8.56"></path>
                      </svg>
                      Sending...
                    </span>
                  ) : (
                    'Send Reset Instructions'
                  )}
                </button>
              </form>

              {/* Back Link */}
              <div className="mt-8 text-center">
                <a
                  href="/signin"
                  className="inline-flex items-center gap-1.5 text-sm font-medium text-[#6B46C1] hover:text-[#5B3CA1] transition-colors group"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" role="img" width="16" height="16" viewBox="0 0 24 24" className="group-hover:-translate-x-0.5 transition-transform">
                    <path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m12 19l-7-7l7-7m7 7H5"></path>
                  </svg>
                  Back to login
                </a>
              </div>
            </div>

            {/* STEP 2: CONFIRMATION */}
            <div
              id="step-2"
              className={`transition-all duration-500 ease-out ${step === 2 ? 'block opacity-100' : 'hidden opacity-0'}`}
            >
              {/* Success Icon */}
              <div className="w-20 h-20 mx-auto bg-green-50 rounded-full flex items-center justify-center mb-6 text-emerald-500 border border-emerald-100 animate-scale-in">
                <svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" role="img" width="40" height="40" viewBox="0 0 24 24" className="text-emerald-500">
                  <path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M22 13V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v12c0 1.1.9 2 2 2h8m10-4l-4 4l-2-2M22 6l-10 7L2 6"></path>
                </svg>
              </div>

              {/* Header */}
              <div className="text-center mb-6">
                <h1 className="font-serif font-bold text-3xl text-[#1F2937] tracking-tight mb-4">Check your email</h1>
                <p className="text-[#78716C] text-[15px] leading-relaxed">
                  We sent password reset instructions to:<br />
                  <span className="font-semibold text-[#6B46C1]">{email}</span>
                </p>
              </div>

              {/* Instructions Box */}
              <div className="bg-[#F3E8FF] border border-[#E9D5FF] rounded-lg p-5 mb-6">
                <div className="flex items-center gap-2 mb-2">
                  <svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" role="img" width="16" height="16" viewBox="0 0 24 24" className="text-[#6B46C1]">
                    <path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 14c.2-1 .7-1.7 1.5-2.5c1-1 1.5-2.4 1.5-3.8c0-3.2-2.7-6-6-6c-3.2 0-6 2.7-6 6c0 1.4.5 2.8 1.5 3.8c.8.8 1.3 1.5 1.5 2.5m-4 3h6m-5.4 3h4.8m-1.2 3h-2.4"></path>
                  </svg>
                  <span className="text-sm font-semibold text-[#5B3CA1]">Tips:</span>
                </div>
                <ul className="text-sm text-[#78716C] space-y-1.5 list-disc list-inside ml-1">
                  <li>Check your spam or junk folder</li>
                  <li>The link expires in 1 hour</li>
                  <li>Request a new one if needed</li>
                </ul>
              </div>

              {/* Actions */}
              <div className="space-y-4">
                <button
                  type="button"
                  onClick={handleResend}
                  disabled={resendCountdown > 0 || loading}
                  className="w-full h-[48px] flex items-center justify-center rounded-lg border border-[#E5E7EB] bg-white text-[15px] font-medium text-[#6B46C1] hover:bg-[#F3E8FF]/50 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-[#6B46C1] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {resendCountdown > 0 ? `Resend available in ${resendCountdown}s` : "Didn't receive it? Resend"}
                </button>

                <div className="text-center pt-2">
                  <a
                    href="/signin"
                    className="inline-flex items-center gap-1.5 text-sm font-medium text-[#78716C] hover:text-[#1F2937] transition-colors"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" role="img" width="16" height="16" viewBox="0 0 24 24">
                      <path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m12 19l-7-7l7-7m7 7H5"></path>
                    </svg>
                    Back to login
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <div className="absolute bottom-6 text-center w-full">
        <p className="text-xs text-[#78716C]/60 font-medium">© 2024 FLOW PRO STUDIOS</p>
      </div>
    </div>
  );
}

