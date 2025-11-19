'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface ButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'hazard' | 'ghost';
  onClick?: () => void;
}

const variants = {
  primary: "bg-cyan-500/10 border-cyan-400 shadow-[0_0_30px_-10px_rgba(0,240,255,0.5)]",
  hazard: "bg-red-500/10 border-red-400 shadow-[0_0_30px_-10px_rgba(255,0,50,0.5)]",
  ghost: "bg-transparent border-white/10 text-white/60 hover:text-white"
};

export const VitalisButton: React.FC<ButtonProps> = ({ children, variant = 'primary', onClick }) => {
  return (
    <motion.button
      onClick={onClick}
      className={`relative px-8 py-4 rounded-xl border backdrop-blur-md overflow-hidden group ${variants[variant]}`}
      whileHover={{ scale: 1.02, z: 10 }}
      whileTap={{ scale: 0.98 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
    >
      {/* Ambient Glow Layer */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 ease-in-out" />
      
      {/* Content */}
      <span className="relative z-10 font-mono tracking-widest text-sm uppercase font-bold text-white flex items-center gap-3">
        {children}
        <motion.div 
          className="w-2 h-2 bg-current rounded-full"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      </span>
    </motion.button>
  );
};

