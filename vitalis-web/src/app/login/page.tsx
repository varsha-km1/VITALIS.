'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { VitalisButton } from '@/components/ui/VitalisButton';
import { api } from '@/lib/api-client';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('admin@vitalis.ai');
  const [password, setPassword] = useState('admin123');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async () => {
    setLoading(true);
    setError('');

    try {
      console.log('🔐 Attempting login...', { email });
      const response = await api.auth.login(email, password);
      
      // Store token and user data
      localStorage.setItem('vitalis_token', response.access_token);
      localStorage.setItem('vitalis_user', JSON.stringify(response.user));
      
      console.log('✅ Token stored, redirecting to dashboard...');
      // Redirect to dashboard
      router.push('/dashboard');
    } catch (err: any) {
      console.error('❌ Login error:', err);
      setError(err.message || 'Authentication failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !loading) {
      e.preventDefault();
      handleLogin();
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center relative overflow-hidden">
      {/* Background Grid */}
      <div 
        className="fixed inset-0 opacity-20" 
        style={{ 
          backgroundImage: 'radial-gradient(#1a1a1a 1px, transparent 1px)', 
          backgroundSize: '40px 40px' 
        }} 
      />

      {/* Glowing orb effect */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 w-full max-w-md px-8"
      >
        {/* Logo */}
        <div className="text-center mb-12">
          <h1 className="text-6xl font-bold tracking-tighter mb-4 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-600">
            VITALIS.
          </h1>
          <p className="text-white/50 text-sm font-mono">
            VETERINARY INTELLIGENCE SYSTEM
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8">
          <div className="space-y-6">
            {/* Email Input */}
            <div>
              <label className="block text-xs text-white/50 mb-2 font-mono uppercase">
                Identification
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyPress={handleKeyPress}
                className="w-full bg-black/50 border border-white/20 rounded-lg px-4 py-3 text-white font-mono focus:border-cyan-400 focus:outline-none transition-colors"
                placeholder="email@vitalis.ai"
                disabled={loading}
              />
            </div>

            {/* Password Input */}
            <div>
              <label className="block text-xs text-white/50 mb-2 font-mono uppercase">
                Security Key
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyPress={handleKeyPress}
                className="w-full bg-black/50 border border-white/20 rounded-lg px-4 py-3 text-white font-mono focus:border-cyan-400 focus:outline-none transition-colors"
                placeholder="••••••••"
                disabled={loading}
              />
            </div>

            {/* Error Message */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-3 bg-red-500/10 border border-red-500/50 rounded-lg text-red-400 text-sm font-mono"
              >
                {error}
              </motion.div>
            )}

            {/* Login Button */}
            <button
              type="button"
              onClick={handleLogin}
              disabled={loading}
              className="w-full relative px-8 py-4 rounded-xl border border-cyan-400 bg-cyan-500/10 backdrop-blur-md hover:bg-cyan-500/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span className="font-mono tracking-widest text-sm uppercase font-bold text-white">
                {loading ? 'AUTHENTICATING...' : 'AUTHENTICATE'}
              </span>
            </button>
          </div>

          {/* Demo Credentials */}
          <div className="mt-6 pt-6 border-t border-white/10">
            <p className="text-xs text-white/40 mb-2 font-mono">Demo Credentials:</p>
            <div className="text-xs text-white/60 font-mono space-y-1">
              <div>Admin: admin@vitalis.ai / admin123</div>
              <div>Vet: vet@vitalis.ai / vet123</div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8 text-xs text-white/30 font-mono">
          VITALIS OS v1.0.0 | HIPAA COMPLIANT | MULTI-TENANT
        </div>
      </motion.div>
    </div>
  );
}

