import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { authClient } from '../lib/auth-client';
import { BrandLogo } from '../components/BrandLogo';

export const ResetPasswordPage: React.FC = () => {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const token = params.get('token') ?? '';
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState<string | null>(token ? null : 'This password reset link is missing its token.');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    if (!token) return setError('This password reset link is invalid or incomplete.');
    if (password.length < 8) return setError('Your new password must be at least 8 characters.');
    if (password !== confirm) return setError('The passwords do not match.');
    setLoading(true);
    try {
      await authClient.resetPassword(token, password);
      setSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to reset your password.');
    } finally { setLoading(false); }
  };

  return (
    <main className="min-h-screen bg-[#0f172a] flex items-center justify-center px-4 py-12 font-inter">
      <section className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-7">
        <button type="button" onClick={() => navigate(-1)} className="mb-4 text-sm font-semibold text-blue-700 hover:underline">← Back</button>
        <div className="flex justify-center mb-6"><BrandLogo variant="full" theme="light" size="lg" /></div>
        {success ? (
          <div className="text-center">
            <h1 className="text-xl font-bold text-slate-900">Password updated</h1>
            <p className="text-sm text-slate-500 mt-2">Your password has been changed successfully.</p>
            <button type="button" onClick={() => navigate('/login')} className="mt-6 w-full rounded-lg bg-[#0051d5] py-3 text-sm font-semibold text-white hover:bg-[#003ea8]">Return to sign in</button>
          </div>
        ) : (
          <>
            <h1 className="text-xl font-bold text-slate-900">Create a new password</h1>
            <p className="text-sm text-slate-500 mt-1 mb-6">Choose a new password for your marketplace account.</p>
            {error && <p className="mb-4 rounded-lg bg-red-50 border border-red-200 px-3 py-2 text-xs text-red-700">{error}</p>}
            <form onSubmit={submit} className="space-y-4">
              <div><label className="block text-xs font-semibold text-slate-700 mb-1">New password</label><input required minLength={8} type="password" value={password} onChange={e => setPassword(e.target.value)} className="w-full px-3 py-2.5 border border-slate-300 rounded-lg text-sm outline-none focus:border-[#0051d5]" /></div>
              <div><label className="block text-xs font-semibold text-slate-700 mb-1">Confirm password</label><input required minLength={8} type="password" value={confirm} onChange={e => setConfirm(e.target.value)} className="w-full px-3 py-2.5 border border-slate-300 rounded-lg text-sm outline-none focus:border-[#0051d5]" /></div>
              <button disabled={loading || !token} type="submit" className="w-full rounded-lg bg-[#0051d5] py-3 text-sm font-semibold text-white hover:bg-[#003ea8] disabled:opacity-60">{loading ? 'Updating…' : 'Update Password'}</button>
            </form>
          </>
        )}
      </section>
    </main>
  );
};
