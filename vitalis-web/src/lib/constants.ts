/**
 * Animation constants for Framer Motion
 * Consistent physics-based animations across the app
 */

export const SPRING_CONFIG = {
  stiff: {
    type: 'spring' as const,
    stiffness: 400,
    damping: 17,
  },
  smooth: {
    type: 'spring' as const,
    stiffness: 260,
    damping: 20,
  },
  gentle: {
    type: 'spring' as const,
    stiffness: 120,
    damping: 14,
  },
};

export const FADE_IN_UP = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
};

export const FADE_IN = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
};

export const SCALE_IN = {
  initial: { opacity: 0, scale: 0.95 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.95 },
};

/**
 * Severity color mapping
 */
export const SEVERITY_COLORS = {
  LOW: 'text-green-400',
  MODERATE: 'text-yellow-400',
  CRITICAL: 'text-red-400',
};

export const SEVERITY_BG = {
  LOW: 'bg-green-500/10 border-green-400',
  MODERATE: 'bg-yellow-500/10 border-yellow-400',
  CRITICAL: 'bg-red-500/10 border-red-400',
};

