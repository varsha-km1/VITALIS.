'use client';

import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';

interface MetricCardProps {
  label: string;
  value: string | number;
  unit?: string;
  icon?: LucideIcon;
  color?: string;
}

export const MetricCard: React.FC<MetricCardProps> = ({ 
  label, 
  value, 
  unit, 
  icon: Icon,
  color = 'text-cyan-400' 
}) => {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="p-4 bg-white/5 rounded-lg border border-white/10"
    >
      <div className="flex items-center justify-between mb-2">
        <div className="text-xs text-white/40 uppercase tracking-wider">{label}</div>
        {Icon && <Icon className={`w-4 h-4 ${color}`} />}
      </div>
      <div className={`text-2xl font-mono ${color} flex items-baseline gap-1`}>
        {value}
        {unit && <span className="text-sm">{unit}</span>}
      </div>
    </motion.div>
  );
};

