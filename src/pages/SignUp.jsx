import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';

export default function SignUp() {
  const navigate = useNavigate();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [marketingOptIn, setMarketingOptIn] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [passwordStrength, setPasswordStrength] = useState({
    length: false,
    upper: false,
    num: false,
    special: false,
    strength: 0
  });

  const togglePassword = () => {
    setShowPassword(!showPassword);
  };

  const checkPasswordStrength = (pwd) => {
    const hasLength = pwd.length >= 8;
    const hasUpper = /[A-Z]/.test(pwd);
    const hasNum = /[0-9]/.test(pwd);
    const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(pwd);

    let strength = 0;
    if (hasLength) strength += 25;
    if (hasUpper) strength += 25;
    if (hasNum) strength += 25;
    if (hasSpecial) strength += 25;

    setPasswordStrength({
      length: hasLength,
      upper: hasUpper,
      num: hasNum,
      special: hasSpecial,
      strength
    });
  };

  const handlePasswordChange = (e) => {
    const value = e.target.value;
    setPassword(value);
    checkPasswordStrength(value);
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setError('');

    // Validation
    let isValid = true;

    if (fullName.length < 2) {
      isValid = false;
    }

    if (!email || !email.includes('@')) {
      isValid = false;
    }

    if (password.length < 8) {
      isValid = false;
    }

    if (!termsAccepted) {
      isValid = false;
    }

    if (!isValid) {
      setError('Please fill in all required fields correctly.');
      return;
    }

    setLoading(true);

    try {
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          }
        }
      });

      if (signUpError) {
        setError(signUpError.message || 'Unable to create account. Please check your information and try again.');
        return;
      }

      if (data?.user) {
        // Show success message and redirect
        alert('Account created successfully! Please check your email to verify your account.');
        navigate('/signin');
      }
    } catch (err) {
      setError(err.message || 'An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getStrengthColor = () => {
    if (passwordStrength.strength <= 25) return 'bg-red-500';
    if (passwordStrength.strength <= 75) return 'bg-yellow-400';
    return 'bg-green-500';
  };

  return (
    <div className="min-h-screen bg-[#FAFAF9] font-sans selection:bg-[#6B46C1] selection:text-white flex overflow-x-hidden">
      {/* LEFT SIDE: VISUAL (Hidden on mobile) */}
      <div className="hidden lg:flex w-1/2 relative bg-gradient-to-bl from-[#6B46C1] via-[#805AD5] to-[#F97316] items-center justify-center overflow-hidden">
        {/* Texture Overlay */}
        <div 
          className="absolute inset-0 mix-blend-overlay opacity-40 pointer-events-none"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.08'/%3E%3C/svg%3E")`
          }}
        />

        {/* Decorative Elements */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#F97316] blur-[120px] opacity-20 rounded-full translate-x-1/4 -translate-y-1/4"></div>
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-[#6B46C1] blur-[120px] opacity-30 rounded-full -translate-x-1/4 translate-y-1/4"></div>

        {/* Decorative Film Strip */}
        <div className="absolute right-0 bottom-20 opacity-10 rotate-12 translate-x-10 pointer-events-none">
          <svg width="400" height="400" viewBox="0 0 24 24" className="text-white">
            <path fill="currentColor" d="M19.5 4h-15A2.5 2.5 0 0 0 2 6.5v11A2.5 2.5 0 0 0 4.5 20h15a2.5 2.5 0 0 0 2.5-2.5v-11A2.5 2.5 0 0 0 19.5 4Zm-15 2h15c.28 0 .5.22.5.5v2.5H18v-1a1 1 0 0 0-2 0v1h-3v-1a1 1 0 0 0-2 0v1H8v-1a1 1 0 0 0-2 0v1H4V6.5c0-.28.22-.5.5-.5Zm15 12h-15c-.28 0-.5-.22-.5-.5V15h2v1a1 1 0 0 0 2 0v-1h3v1a1 1 0 0 0 2 0v-1h3v1a1 1 0 0 0 2 0v-1h2v2.5c0 .28-.22.5-.5.5Z"></path>
          </svg>
        </div>

        {/* Content */}
        <div className="relative z-10 max-w-lg px-12 animate-fade-in">
          {/* Logo Mark */}
          <div className="w-20 h-20 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl flex items-center justify-center mb-8 shadow-2xl">
            <svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" role="img" width="40" height="40" viewBox="0 0 24 24" className="text-white">
              <path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M20.2 6L3 11l-.9-2.4c-.3-1.1.3-2.2 1.3-2.5l13.5-4c1.1-.3 2.2.3 2.5 1.3Zm-14-.7l3.1 3.9m3.1-5.8l3.1 4M3 11h18v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2Z"></path>
            </svg>
          </div>

          <h1 className="font-serif italic text-5xl text-white mb-8 leading-tight tracking-tight drop-shadow-sm">
            Start creating <br />today.
          </h1>

          {/* Benefits List */}
          <ul className="space-y-5 text-lg text-white/90">
            <li className="flex items-center gap-4">
              <div className="flex-shrink-0 w-6 h-6 rounded-full bg-[#14B8A6]/20 flex items-center justify-center border border-[#14B8A6]/30">
                <svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" role="img" width="14" height="14" viewBox="0 0 24 24" className="text-[#14B8A6]">
                  <path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M20 6L9 17l-5-5"></path>
                </svg>
              </div>
              <span>Unlimited projects</span>
            </li>
            <li className="flex items-center gap-4">
              <div className="flex-shrink-0 w-6 h-6 rounded-full bg-[#14B8A6]/20 flex items-center justify-center border border-[#14B8A6]/30">
                <svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" role="img" width="14" height="14" viewBox="0 0 24 24" className="text-[#14B8A6]">
                  <path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M20 6L9 17l-5-5"></path>
                </svg>
              </div>
              <span>Collaborate with your team</span>
            </li>
            <li className="flex items-center gap-4">
              <div className="flex-shrink-0 w-6 h-6 rounded-full bg-[#14B8A6]/20 flex items-center justify-center border border-[#14B8A6]/30">
                <svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" role="img" width="14" height="14" viewBox="0 0 24 24" className="text-[#14B8A6]">
                  <path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M20 6L9 17l-5-5"></path>
                </svg>
              </div>
              <span>Export production-ready docs</span>
            </li>
          </ul>
        </div>

        {/* Copyright */}
        <div className="absolute bottom-8 left-8 text-white/40 text-xs font-medium tracking-wide">
          © 2024 FLOW PRO STUDIOS
        </div>
      </div>

      {/* RIGHT SIDE: SIGNUP FORM */}
      <div className="w-full lg:w-1/2 flex flex-col relative bg-white h-screen overflow-y-auto">
        {/* Mobile Header */}
        <div className="lg:hidden p-6 flex items-center gap-2">
          <div className="w-8 h-8 bg-[#6B46C1] rounded-lg flex items-center justify-center text-white">
            <svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" role="img" width="18" height="18" viewBox="0 0 24 24" className="text-white">
              <path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.2 6L3 11l-.9-2.4c-.3-1.1.3-2.2 1.3-2.5l13.5-4c1.1-.3 2.2.3 2.5 1.3Zm-14-.7l3.1 3.9m3.1-5.8l3.1 4M3 11h18v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2Z"></path>
            </svg>
          </div>
          <span className="font-serif font-bold text-xl text-[#1F2937]">Flow Pro</span>
        </div>

        {/* Top Right Actions */}
        <div className="absolute top-6 right-6 lg:top-8 lg:right-12 hidden sm:block z-20">
          <a href="/" className="text-sm font-medium text-[#78716C] hover:text-[#6B46C1] transition-colors flex items-center gap-1.5 group">
            <svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" role="img" width="16" height="16" viewBox="0 0 24 24" className="group-hover:-translate-x-0.5 transition-transform">
              <path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m12 19l-7-7l7-7m7 7H5"></path>
            </svg>
            Back to home
          </a>
        </div>

        {/* Main Form Container */}
        <div className="flex-1 flex items-center justify-center px-6 sm:px-12 lg:px-16 py-12">
          <div className="w-full max-w-[480px] animate-slide-up">
            {/* Header */}
            <div className="mb-8 text-center lg:text-left">
              <h2 className="font-serif font-bold text-3xl sm:text-4xl text-[#1F2937] tracking-tight mb-2">Create your account</h2>
              <p className="text-[#78716C] text-[15px]">Join thousands of filmmakers.</p>
            </div>

            {/* Error Banner */}
            {error && (
              <div className="mb-6 p-3 bg-red-50 border-l-4 border-red-500 rounded-r-md flex items-start gap-3 animate-fade-in">
                <svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" role="img" width="18" height="18" viewBox="0 0 24 24" className="text-red-500 mt-0.5 shrink-0">
                  <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeWidth="2"></circle>
                  <path fill="none" stroke="currentColor" strokeWidth="2" d="M12 8v4m0 4h.01"></path>
                </svg>
                <div className="flex-1">
                  <h4 className="text-sm font-semibold text-red-800">Unable to create account</h4>
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

            {/* Social Signup */}
            <div className="space-y-3 mb-6">
              <button
                type="button"
                className="w-full flex items-center justify-center gap-3 px-4 py-3 border border-gray-200 rounded-lg shadow-sm bg-white text-sm font-semibold text-[#1F2937] hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-gray-200"
              >
                <svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" role="img" width="20" height="20" viewBox="0 0 256 262" className="w-5 h-5">
                  <path fill="#4285F4" d="M255.878 133.451c0-10.734-.871-18.567-2.756-26.69H130.55v48.448h71.947c-1.45 12.04-9.283 30.172-26.69 42.356l-.244 1.622l38.755 30.023l2.685.268c24.659-22.774 38.875-56.282 38.875-96.027"></path>
                  <path fill="#34A853" d="M130.55 261.1c35.248 0 64.839-11.605 86.453-31.622l-41.196-31.913c-11.024 7.688-25.82 13.055-45.257 13.055c-34.523 0-63.824-22.773-74.269-54.25l-1.531.13l-40.298 31.187l-.527 1.465C35.393 231.798 79.49 261.1 130.55 261.1"></path>
                  <path fill="#FBBC05" d="M56.281 156.37c-2.756-8.123-4.351-16.827-4.351-25.82c0-8.994 1.595-17.697 4.206-25.82l-.073-1.73L15.26 71.312l-1.335.635C5.077 89.644 0 109.517 0 130.55s5.077 40.905 13.925 58.602z"></path>
                  <path fill="#EB4335" d="M130.55 50.479c24.514 0 41.05 10.589 50.479 19.438l36.844-35.974C195.245 12.91 165.798 0 130.55 0C79.49 0 35.393 29.301 13.925 71.947l42.211 32.783c10.59-31.477 39.891-54.251 74.414-54.251"></path>
                </svg>
                Continue with Google
              </button>
              <button
                type="button"
                className="w-full flex items-center justify-center gap-3 px-4 py-3 border border-gray-200 rounded-lg shadow-sm bg-white text-sm font-semibold text-[#1F2937] hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-gray-200"
              >
                <svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" role="img" width="20" height="20" viewBox="0 0 24 24" className="text-black">
                  <g fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2">
                    <path d="M12 6.528V3a1 1 0 0 1 1-1h0"></path>
                    <path d="M18.237 21A15 15 0 0 0 22 11a6 6 0 0 0-10-4.472A6 6 0 0 0 2 11a15.1 15.1 0 0 0 3.763 10a3 3 0 0 0 3.648.648a5.5 5.5 0 0 1 5.178 0A3 3 0 0 0 18.237 21"></path>
                  </g>
                </svg>
                Continue with Apple
              </button>
            </div>

            <p className="text-center text-xs text-[#78716C] mb-6">Quick setup, no password needed</p>

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">or sign up with email</span>
              </div>
            </div>

            {/* Email Form */}
            <form onSubmit={handleSignup} className="space-y-5" noValidate>
              {/* Full Name */}
              <div className="space-y-1.5">
                <label htmlFor="fullname" className="block text-sm font-medium text-[#1F2937]">Full Name</label>
                <input
                  type="text"
                  id="fullname"
                  name="fullname"
                  autoComplete="name"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="block w-full px-4 py-3 rounded-lg border border-gray-200 text-[#1F2937] placeholder-gray-400 focus:outline-none focus:border-[#6B46C1] focus:ring-1 focus:ring-[#6B46C1] transition-all sm:text-sm"
                  placeholder="John Doe"
                />
              </div>

              {/* Email */}
              <div className="space-y-1.5">
                <label htmlFor="email" className="block text-sm font-medium text-[#1F2937]">Email</label>
                <div className="relative">
                  <input
                    type="email"
                    id="email"
                    name="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="block w-full px-4 py-3 rounded-lg border border-gray-200 text-[#1F2937] placeholder-gray-400 focus:outline-none focus:border-[#6B46C1] focus:ring-1 focus:ring-[#6B46C1] transition-all sm:text-sm"
                    placeholder="name@production.com"
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-1.5">
                <label htmlFor="password" className="block text-sm font-medium text-[#1F2937]">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    name="password"
                    autoComplete="new-password"
                    required
                    value={password}
                    onChange={handlePasswordChange}
                    className="block w-full px-4 py-3 rounded-lg border border-gray-200 text-[#1F2937] placeholder-gray-400 focus:outline-none focus:border-[#6B46C1] focus:ring-1 focus:ring-[#6B46C1] transition-all sm:text-sm pr-10"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={togglePassword}
                    className="absolute right-3 top-3 text-gray-400 hover:text-[#6B46C1] transition-colors focus:outline-none"
                  >
                    {showPassword ? (
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24">
                        <g fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2">
                          <path d="M10.733 5.076a10.744 10.744 0 0 1 11.205 6.575a1 1 0 0 1 0 .696a10.8 10.8 0 0 1-1.444 2.49m-6.41-.679a3 3 0 0 1-4.242-4.242"></path>
                          <path d="M17.479 17.499a10.75 10.75 0 0 1-15.417-5.151a1 1 0 0 1 0-.696a10.75 10.75 0 0 1 4.446-5.143M2 2l20 20"></path>
                        </g>
                      </svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24">
                        <g fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2">
                          <path d="M2.062 12.348a1 1 0 0 1 0-.696a10.75 10.75 0 0 1 19.876 0a1 1 0 0 1 0 .696a10.75 10.75 0 0 1-19.876 0"></path>
                          <circle cx="12" cy="12" r="3"></circle>
                        </g>
                      </svg>
                    )}
                  </button>
                </div>

                {/* Password Strength Meter */}
                {password && (
                  <div className="pt-1">
                    <div className="h-1 w-full bg-gray-100 rounded-full overflow-hidden mb-2">
                      <div 
                        className={`h-full strength-bar transition-all duration-300 ${getStrengthColor()}`}
                        style={{ width: `${passwordStrength.strength}%` }}
                      ></div>
                    </div>
                    <div className="flex gap-3 text-[11px] flex-wrap">
                      <span className={`flex items-center gap-1 transition-colors ${passwordStrength.length ? 'text-[#14B8A6] font-medium' : 'text-[#78716C]'}`}>
                        <div className={`w-1.5 h-1.5 rounded-full ${passwordStrength.length ? 'bg-[#14B8A6]' : 'bg-gray-300'}`}></div>
                        8+ chars
                      </span>
                      <span className={`flex items-center gap-1 transition-colors ${passwordStrength.upper ? 'text-[#14B8A6] font-medium' : 'text-[#78716C]'}`}>
                        <div className={`w-1.5 h-1.5 rounded-full ${passwordStrength.upper ? 'bg-[#14B8A6]' : 'bg-gray-300'}`}></div>
                        Uppercase
                      </span>
                      <span className={`flex items-center gap-1 transition-colors ${passwordStrength.num ? 'text-[#14B8A6] font-medium' : 'text-[#78716C]'}`}>
                        <div className={`w-1.5 h-1.5 rounded-full ${passwordStrength.num ? 'bg-[#14B8A6]' : 'bg-gray-300'}`}></div>
                        Number
                      </span>
                      <span className={`flex items-center gap-1 transition-colors ${passwordStrength.special ? 'text-[#14B8A6] font-medium' : 'text-[#78716C]'}`}>
                        <div className={`w-1.5 h-1.5 rounded-full ${passwordStrength.special ? 'bg-[#14B8A6]' : 'bg-gray-300'}`}></div>
                        Special
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Terms Checkbox */}
              <div className="flex items-start pt-2">
                <div className="flex items-center h-5">
                  <input
                    id="terms"
                    name="terms"
                    type="checkbox"
                    required
                    checked={termsAccepted}
                    onChange={(e) => setTermsAccepted(e.target.checked)}
                    className="h-4 w-4 border-gray-300 rounded focus:ring-[#6B46C1] cursor-pointer text-[#6B46C1]"
                  />
                </div>
                <div className="ml-2 text-sm">
                  <label htmlFor="terms" className="font-medium text-[#78716C] cursor-pointer select-none">
                    I agree to the <a href="#" className="text-[#6B46C1] hover:underline">Terms of Service</a> and <a href="#" className="text-[#6B46C1] hover:underline">Privacy Policy</a>
                  </label>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-3.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-semibold text-white bg-[#6B46C1] hover:bg-[#5B3CA1] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#6B46C1] transition-all transform active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed mt-4"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" role="img" width="18" height="18" viewBox="0 0 24 24" className="animate-spin">
                      <path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 1 1-6.219-8.56"></path>
                    </svg>
                    Creating account...
                  </span>
                ) : (
                  'Create Account'
                )}
              </button>

              {/* Marketing Opt-in */}
              <div className="flex items-start justify-center">
                <div className="flex items-center h-5">
                  <input
                    id="marketing"
                    name="marketing"
                    type="checkbox"
                    checked={marketingOptIn}
                    onChange={(e) => setMarketingOptIn(e.target.checked)}
                    className="h-3.5 w-3.5 border-gray-300 rounded focus:ring-[#6B46C1] cursor-pointer text-[#6B46C1]"
                  />
                </div>
                <label htmlFor="marketing" className="ml-2 text-xs text-[#78716C] cursor-pointer select-none">
                  Send me product updates and tips
                </label>
              </div>
            </form>

            {/* Footer Link */}
            <div className="mt-8 text-center text-sm text-[#78716C]">
              <p>Already have an account? <a href="/signin" className="font-semibold text-[#6B46C1] hover:text-[#5B3CA1] hover:underline transition-colors">Sign in</a></p>
            </div>

            {/* Security Badges */}
            <div className="mt-10 flex items-center justify-center gap-4 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
              <div className="flex items-center gap-1.5 text-xs text-[#78716C]">
                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" className="text-[#14B8A6]">
                  <g fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect width="18" height="11" x="3" y="11" rx="2" ry="2"></rect>
                    <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                  </g>
                </svg>
                Secure 256-bit Encryption
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

