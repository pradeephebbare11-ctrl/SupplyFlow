import React, { useState } from 'react';
import { isSupabaseConfigured, signIn, signUp } from '../lib/supabase';

export const LoginView: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setMessage('');
    setIsLoading(true);
    try {
      const session = isSignUp ? await signUp(email, password) : await signIn(email, password);
      setMessage(session ? 'Account ready. Loading your workspace...' : 'Check your email to confirm your account.');
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Unable to authenticate.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#191b23] flex items-center justify-center p-4">
      <section className="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden">
        <div className="bg-[#004ac6] px-7 py-8 text-white">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-100">SupplyFlow</p>
          <h1 className="text-3xl font-bold mt-3">{isSignUp ? 'Create your account' : 'Welcome back'}</h1>
          <p className="text-sm text-blue-100 mt-2">Sign in to access your warehouse workspace.</p>
        </div>
        <form onSubmit={handleSubmit} className="p-7 space-y-5">
          {!isSupabaseConfigured && (
            <p className="p-3 rounded-lg bg-[#ffdad6] text-[#ba1a1a] text-sm">
              Supabase is not configured. Add the VITE_SUPABASE values to `.env.local`.
            </p>
          )}
          <label className="block">
            <span className="block text-xs font-semibold text-[#434655] uppercase tracking-wider mb-1.5">Email</span>
            <input
              required
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="w-full px-3.5 py-3 bg-white border border-[#c3c6d7] rounded-lg text-sm focus:outline-none focus:border-[#004ac6] focus:ring-1 focus:ring-[#004ac6]"
              placeholder="you@company.com"
            />
          </label>
          <label className="block">
            <span className="block text-xs font-semibold text-[#434655] uppercase tracking-wider mb-1.5">Password</span>
            <input
              required
              minLength={6}
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="w-full px-3.5 py-3 bg-white border border-[#c3c6d7] rounded-lg text-sm focus:outline-none focus:border-[#004ac6] focus:ring-1 focus:ring-[#004ac6]"
              placeholder="At least 6 characters"
            />
          </label>
          {message && <p className="text-sm text-[#434655]">{message}</p>}
          <button
            disabled={isLoading || !isSupabaseConfigured}
            className="w-full bg-[#004ac6] hover:bg-[#003ea8] disabled:opacity-50 text-white font-semibold py-3 rounded-lg transition-colors"
          >
            {isLoading ? 'Please wait...' : isSignUp ? 'Create Account' : 'Sign In'}
          </button>
          <button
            type="button"
            onClick={() => { setIsSignUp(!isSignUp); setMessage(''); }}
            className="w-full text-sm font-semibold text-[#004ac6] hover:underline"
          >
            {isSignUp ? 'Already have an account? Sign in' : 'Need an account? Create one'}
          </button>
        </form>
      </section>
    </main>
  );
};
