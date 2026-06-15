'use client';

import { motion, AnimatePresence } from 'framer-motion';

interface PageTransitionProps {
  children: React.ReactNode;
}

const pageVariants = {
  initial: {
    opacity: 0,
    x: -20,
    scale: 0.95,
  },
  enter: {
    opacity: 1,
    x: 0,
    scale: 1,
  },
  exit: {
    opacity: 0,
    x: 20,
    scale: 0.95,
  },
};

const pageTransition = {
  type: 'tween',
  ease: [0.4, 0, 0.2, 1], // Custom easing for smooth animation
  duration: 0.3,
};

export function PageTransition({ children }: PageTransitionProps) {
  return (
    <motion.div
      initial="initial"
      animate="enter"
      exit="exit"
      variants={pageVariants}
      transition={pageTransition}
      className="flex-1 flex flex-col"
    >
      {children}
    </motion.div>
  );
}

// Pour les transitions en fonction de la direction (gauche/droite)
interface PageTransitionWithDirectionProps {
  children: React.ReactNode;
  direction?: 'left' | 'right' | 'up' | 'down';
}

export function PageTransitionWithDirection({
  children,
  direction = 'right',
}: PageTransitionWithDirectionProps) {
  const getVariants = () => {
    switch (direction) {
      case 'left':
        return {
          initial: { opacity: 0, x: 20, scale: 0.95 },
          enter: { opacity: 1, x: 0, scale: 1 },
          exit: { opacity: 0, x: -20, scale: 0.95 },
        };
      case 'right':
        return {
          initial: { opacity: 0, x: -20, scale: 0.95 },
          enter: { opacity: 1, x: 0, scale: 1 },
          exit: { opacity: 0, x: 20, scale: 0.95 },
        };
      case 'up':
        return {
          initial: { opacity: 0, y: 20, scale: 0.95 },
          enter: { opacity: 1, y: 0, scale: 1 },
          exit: { opacity: 0, y: -20, scale: 0.95 },
        };
      case 'down':
        return {
          initial: { opacity: 0, y: -20, scale: 0.95 },
          enter: { opacity: 1, y: 0, scale: 1 },
          exit: { opacity: 0, y: 20, scale: 0.95 },
        };
    }
  };

  return (
    <motion.div
      initial="initial"
      animate="enter"
      exit="exit"
      variants={getVariants()}
      transition={pageTransition}
      className="flex-1 flex flex-col"
    >
      {children}
    </motion.div>
  );
}

// Transition de fondu simple
export function FadeTransition({ children }: PageTransitionProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25, ease: 'easeInOut' }}
      className="flex-1 flex flex-col"
    >
      {children}
    </motion.div>
  );
}

// Transition avec effet d'échelle
export function ScaleTransition({ children }: PageTransitionProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{
        duration: 0.3,
        ease: [0.4, 0, 0.2, 1],
      }}
      className="flex-1 flex flex-col"
    >
      {children}
    </motion.div>
  );
}

// Transition avec effet de slide et fade
export function SlideFadeTransition({ children }: PageTransitionProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{
        duration: 0.35,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
      className="flex-1 flex flex-col"
    >
      {children}
    </motion.div>
  );
}

// Variants pour les éléments de liste
export const listItemVariants = {
  initial: { opacity: 0, x: -20 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: 20 },
};

export const listContainerVariants = {
  initial: {},
  animate: {
    transition: {
      staggerChildren: 0.05,
    },
  },
  exit: {},
};