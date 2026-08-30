import React, { useState } from 'react';
import { authClient } from '../lib/auth-client';
import type { ScreenType } from '../types';
import { BrandLogo } from '../components/BrandLogo';
import { 
  Lock, 
  Mail, 
  Eye, 
  EyeOff, 
  ArrowRight
} from 'lucide-react';

interface AuthLoginViewProps {
  onLoginSuccess: (role: 'admin' | 'app_user') => void | Promise<void>;
  onNavigate: (screen: ScreenType) => void;
}

export const AuthLoginView: React.FC<AuthLoginViewProps> = ({
  onLoginSuccess,
  onNavigate
}) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [isResetMode, setIsResetMode] = useState(false);
  const [resetSent, setResetSent] = useState(false);
  const [signupSent, setSignupSent] = useState(false);

  const handleGoogle = async () => {
    setError(null);
    try { await authClient.signInWithGoogle(); } catch (err) { setError(err instanceof Error ? err.message : 'Unable to start Google sign in'); }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSignupSent(false);
    try {
      if (isResetMode) { await authClient.requestPasswordReset(email.trim()); setResetSent(true); return; }
      const session = isSignUp
        ? await authClient.signUp(name.trim(), email.trim(), password)
        : await authClient.signIn(email.trim(), password, rememberMe);
      if (!session) { setSignupSent(true); setIsSignUp(false); return; }
      await onLoginSuccess(session.user.role === 'ADMIN' ? 'admin' : 'app_user');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to sign in');
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <div className="min-h-screen bg-[#0f172a] flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-inter relative overflow-hidden">
      {/* Background glowing gradients */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10 text-center flex flex-col items-center">
        {/* Logo */}
        <div className="mb-4 bg-white/95 backdrop-blur-md p-4 rounded-2xl shadow-xl inline-block border border-white/20">
          <BrandLogo variant="full" theme="light" size="lg" />
        </div>
        <p className="mt-1 text-sm text-slate-300">
          B2B Product Sourcing & Order Management
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10 px-4 sm:px-0">
        <div className="bg-white py-8 px-6 shadow-2xl rounded-2xl sm:px-10 border border-slate-100">
          <div className="mb-6">
            <h3 className="text-xl font-bold font-public-sans text-slate-900">
              {isResetMode ? 'Reset your password' : isSignUp ? 'Create your account' : 'Sign in to your account'}
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              {isResetMode ? 'Enter your email and we will send you a password reset link.' : isSignUp ? 'Create a buyer account to place and track orders.' : 'Enter your credentials to access your marketplace account.'}
            </p>
          </div>

          {!isResetMode && <button
            type="button"
            onClick={() => void handleGoogle()}
            className="w-full inline-flex justify-center items-center py-2.5 px-4 border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 transition-colors shadow-2xs mb-6"
          >
           
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-google w-4 h-4 mr-2" viewBox="0 0 16 16">
            <path d="M15.545 6.558a9.4 9.4 0 0 1 .139 1.626c0 2.434-.87 4.492-2.384 5.885h.002C11.978 15.292 10.158 16 8 16A8 8 0 1 1 8 0a7.7 7.7 0 0 1 5.352 2.082l-2.284 2.284A4.35 4.35 0 0 0 8 3.166c-2.087 0-3.86 1.408-4.492 3.304a4.8 4.8 0 0 0 0 3.063h.003c.635 1.893 2.405 3.301 4.492 3.301 1.078 0 2.004-.276 2.722-.764h-.003a3.7 3.7 0 0 0 1.599-2.431H8v-3.08z"/>
            </svg>
            <span>Continue with Google</span>
          </button>}

          {!isResetMode && <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-2 text-slate-400 font-semibold tracking-wider">
                Or sign in with email
              </span>
            </div>
          </div>}

          {signupSent && <p className="mb-4 rounded-lg bg-emerald-50 border border-emerald-200 px-3 py-2 text-xs text-emerald-700">Account created. Check your email to verify your account, then sign in.</p>}

          {resetSent && <p className="mb-4 rounded-lg bg-emerald-50 border border-emerald-200 px-3 py-2 text-xs text-emerald-700">If an account exists for that email, a password reset link has been sent.</p>}

          {error && <p className="mb-4 rounded-lg bg-red-50 border border-red-200 px-3 py-2 text-xs text-red-700">{error}</p>}

          <form className="space-y-4" onSubmit={handleSubmit}>
            {isSignUp && <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Full Name</label>
              <input type="text" required value={name} onChange={(e) => setName(e.target.value)} className="w-full px-3 py-2.5 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-[#0051d5] focus:border-[#0051d5] outline-none" placeholder="Your full name" />
            </div>}

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Work Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-9 w-full px-3 py-2.5 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-[#0051d5] focus:border-[#0051d5] outline-none"
                  placeholder="name@company.com"
                />
              </div>
            </div>

            {!isResetMode && <div>
              <div className="flex justify-between items-center mb-1">
                <label className="block text-xs font-semibold text-slate-700">
                  Password
                </label>
                {!isSignUp && !isResetMode && <button type="button" onClick={() => { setIsResetMode(true); setError(null); setResetSent(false); }} className="text-xs text-[#0051d5] font-semibold hover:underline">Forgot password?</button>}
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-9 pr-10 w-full px-3 py-2.5 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-[#0051d5] focus:border-[#0051d5] outline-none"
                  placeholder="••••••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>}

            {!isResetMode && <div className="flex items-center justify-between py-1">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded border-slate-300 text-[#0051d5] focus:ring-[#0051d5]"
                />
                <span className="text-xs text-slate-600">Keep me signed in on this device</span>
              </label>
            </div>}

            <button
              id="auth-sign-in-btn"
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#0051d5] hover:bg-[#003ea8] text-white py-3 px-4 rounded-lg font-semibold text-sm shadow-md transition-all flex items-center justify-center gap-2 active:scale-98 disabled:opacity-75"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <>
                  <span>{isResetMode ? 'Send Reset Link' : isSignUp ? 'Create Account' : 'Sign In'}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <p className="mt-5 text-center text-xs text-slate-500">
            {isResetMode ? 'Remember your password?' : isSignUp ? 'Already have an account?' : 'New to the marketplace?'}{' '}
            <button type="button" onClick={() => { if (isResetMode) { setIsResetMode(false); setResetSent(false); } else { setIsSignUp(!isSignUp); } setError(null); }} className="font-semibold text-[#0051d5] hover:underline">{isResetMode ? 'Back to sign in' : isSignUp ? 'Sign in' : 'Create an account'}</button>
          </p>

        </div>

        <div className="mt-6 text-center">
          <button
            onClick={() => onNavigate('marketplace')}
            className="text-xs text-slate-400 hover:text-white transition-colors"
          >
            ← Back to Public Sourcing Marketplace
          </button>
        </div>
      </div>
    </div>
  );
};
