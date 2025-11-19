'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';
import { SPRING_CONFIG } from '@/lib/constants';

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  hover?: boolean;
}

export const GlassCard: React.FC<GlassCardProps> = ({ 
  children, 
  className = '', 
  delay = 0,
  hover = true 
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ ...SPRING_CONFIG.smooth, delay }}
      whileHover={hover ? { y: -5, borderColor: 'rgba(0, 240, 255, 0.3)' } : undefined}
      className={`
        relative rounded-2xl border border-white/10 
        bg-white/5 backdrop-blur-xl
        overflow-hidden
        ${className}
      `}
    >
      {children}
    </motion.div>
  );
};

