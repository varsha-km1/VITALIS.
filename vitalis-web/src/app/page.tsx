'use client';

import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { VitalisButton } from '@/components/ui/VitalisButton';

export default function Home() {
  const router = useRouter();

  return (
    <main className="min-h-screen bg-[#050505] flex items-center justify-center relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute inset-0" style={{ 
          backgroundImage: 'radial-gradient(circle at 50% 50%, rgba(0, 240, 255, 0.1) 0%, transparent 50%)',
          animation: 'pulse 4s ease-in-out infinite'
        }} />
      </div>

      <motion.div 
        className="relative z-10 text-center px-8"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <motion.h1 
          className="text-8xl font-bold mb-6 tracking-tighter"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600">
            VITALIS OS
          </span>
        </motion.h1>

        <motion.p 
          className="text-xl text-white/60 mb-12 max-w-2xl mx-auto font-light"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          Veterinary Intelligence & Triage Automated Life-support System
          <br />
          <span className="text-cyan-400 text-sm font-mono mt-2 block">
            The future of veterinary care is here.
          </span>
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <VitalisButton onClick={() => router.push('/dashboard')}>
            Enter System
          </VitalisButton>
        </motion.div>

        <motion.div 
          className="mt-16 flex justify-center gap-12 text-xs font-mono text-white/40"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          <div>AI DIAGNOSTICS</div>
          <div>•</div>
          <div>REAL-TIME TRIAGE</div>
          <div>•</div>
          <div>PREDICTIVE ANALYTICS</div>
        </motion.div>
      </motion.div>
    </main>
  );
}

