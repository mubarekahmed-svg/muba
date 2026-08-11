import React, { useState } from 'react';
import { Lock, User, KeyRound, AlertCircle, Check, X, ShieldCheck, LogIn } from 'lucide-react';
import { AdminUser } from '../types';
import { signInWithGoogleAuth } from '../lib/firebaseService';

interface AdminLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: AdminUser) => void;
  theme?: 'light' | 'dark';
}

export const AdminLoginModal: React.FC<AdminLoginModalProps> = ({ isOpen, onClose, onLoginSuccess, theme = 'light' }) => {
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('admin123');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Login failed. Please check credentials.');
      }

      // Store in localStorage for session persistence
      localStorage.setItem('adminToken', data.user.token);
      localStorage.setItem('adminUser', JSON.stringify(data.user));

      onLoginSuccess(data.user);
      onClose();
    } catch (err: any) {
      setError(err.message || 'Authentication error');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setError(null);
    try {
      const user = await signInWithGoogleAuth();
      const adminUser: AdminUser = {
        username: user.email || user.displayName || 'Google Admin',
        token: user.uid,
        role: 'admin',
        lastLogin: new Date().toISOString()
      };
      localStorage.setItem('adminToken', user.uid);
      localStorage.setItem('adminUser', JSON.stringify(adminUser));
      onLoginSuccess(adminUser);
      onClose();
    } catch (err: any) {
      console.error('Google Auth Login Failed:', err);
      setError('Google Authentication failed or was cancelled.');
    } finally {
      setLoading(false);
    }
  };

  const fillDefaultCredentials = () => {
    setUsername('admin');
    setPassword('admin123');
    setError(null);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-[#0B132B] border-2 border-indigo-500/40 w-full max-w-md rounded-lg p-6 sm:p-8 text-white shadow-2xl space-y-6 relative overflow-hidden">
        
        {/* Glow ambient accent */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-indigo-600/30 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-purple-600/20 rounded-full blur-3xl pointer-events-none" />

        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-indigo-300 hover:text-white text-xs font-mono font-bold cursor-pointer transition-colors px-2 py-1 bg-indigo-950/80 border border-indigo-500/30 rounded"
        >
          ✕
        </button>

        {/* Modal Title */}
        <div className="space-y-2 relative z-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-indigo-950/90 border border-indigo-400/30 rounded-full text-[10px] font-mono uppercase tracking-[0.2em] text-indigo-200 font-bold shadow-xs">
            <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" />
            Faculty Administrative Portal
          </div>
          <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-wider text-white">
            Manager Login
          </h2>
          <p className="text-xs text-indigo-200/90 font-serif-editorial italic font-medium">
            Authenticate to manage publication records, faculty items, and inquiry messages.
          </p>
        </div>

        {/* Credential Tip Box */}
        <div className="p-3.5 bg-indigo-950/70 border border-indigo-500/30 rounded-md text-[11px] font-mono text-indigo-200 space-y-1.5 shadow-inner">
          <div className="flex items-center justify-between font-bold text-white uppercase tracking-wider text-[10px]">
            <span className="text-indigo-300">Default Manager Account:</span>
            <button
              type="button"
              onClick={fillDefaultCredentials}
              className="text-[10px] font-bold px-2 py-0.5 bg-indigo-600/80 hover:bg-indigo-500 text-white rounded cursor-pointer transition-all shadow-xs"
            >
              Autofill
            </button>
          </div>
          <div className="flex gap-4 text-[11px] pt-0.5">
            <span>Username: <strong className="text-emerald-300 font-mono">admin</strong></span>
            <span>Password: <strong className="text-amber-300 font-mono">admin123</strong></span>
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="p-3.5 bg-rose-950/90 border border-rose-500/60 text-rose-200 text-xs font-mono flex items-center gap-2 rounded-md shadow-xs">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            <span className="font-semibold">{error}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleLogin} className="space-y-4 font-mono text-xs relative z-10">
          <div>
            <label className="block text-[10px] uppercase tracking-widest text-indigo-300 font-bold mb-1">
              Username or Email
            </label>
            <div className="relative">
              <User className="w-4 h-4 absolute left-3 top-2.5 text-indigo-400" />
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                placeholder="admin"
                className="w-full pl-9 pr-3 py-2.5 bg-slate-900/90 border border-indigo-500/40 rounded-md text-white font-semibold focus:outline-none focus:border-indigo-400 placeholder-indigo-400/50 shadow-inner"
              />
            </div>
          </div>

          <div>
            <label className="block text-[10px] uppercase tracking-widest text-indigo-300 font-bold mb-1">
              Password
            </label>
            <div className="relative">
              <KeyRound className="w-4 h-4 absolute left-3 top-2.5 text-indigo-400" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
                className="w-full pl-9 pr-3 py-2.5 bg-slate-900/90 border border-indigo-500/40 rounded-md text-white font-semibold focus:outline-none focus:border-indigo-400 placeholder-indigo-400/50 shadow-inner"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-400 hover:to-purple-500 text-white font-black text-xs uppercase tracking-[0.2em] transition-all rounded-md cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2 shadow-md shadow-indigo-950"
          >
            {loading ? 'Authenticating...' : 'Enter Admin Portal'}
          </button>

          <div className="flex items-center gap-3 my-2">
            <div className="h-[1px] bg-indigo-500/20 flex-1" />
            <span className="text-[10px] text-indigo-300/60 uppercase font-mono tracking-widest font-bold">OR</span>
            <div className="h-[1px] bg-indigo-500/20 flex-1" />
          </div>

          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={loading}
            className="w-full py-2.5 bg-slate-900 border border-indigo-400/40 hover:bg-slate-800 text-indigo-100 font-bold text-xs uppercase tracking-wider rounded-md cursor-pointer transition-all flex items-center justify-center gap-2 shadow-sm"
          >
            <LogIn className="w-3.5 h-3.5 text-indigo-400" />
            <span>Sign In with Firebase Google Auth</span>
          </button>
        </form>

        <div className="text-center pt-2 border-t border-indigo-500/20">
          <p className="text-[10px] font-mono text-indigo-300/70 font-semibold">
            Werabe University Academic Faculty Management &bull; Secured Channel
          </p>
        </div>

      </div>
    </div>
  );
};
