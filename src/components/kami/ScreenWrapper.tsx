'use client';

import { ReactNode } from 'react';
import { motion } from 'framer-motion';

interface ScreenWrapperProps {
  children: ReactNode;
  className?: string;
  type?: 'fade' | 'slide' | 'scale' | 'blur';
}

const animations = {
  fade: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
  },
  slide: {
    initial: { x: 20, opacity: 0 },
    animate: { x: 0, opacity: 1 },
    exit: { x: -20, opacity: 0 },
  },
  scale: {
    initial: { scale: 0.95, opacity: 0 },
    animate: { scale: 1, opacity: 1 },
    exit: { scale: 1.05, opacity: 0 },
  },
  blur: {
    initial: { opacity: 0, filter: 'blur(10px)' },
    animate: { opacity: 1, filter: 'blur(0px)' },
    exit: { opacity: 0, filter: 'blur(10px)' },
  },
};

export function ScreenWrapper({ children, className = '', type = 'slide' }: ScreenWrapperProps) {
  const animation = animations[type];

  return (
    <motion.div
      initial="initial"
      animate="animate"
      exit="exit"
      variants={animation}
      transition={{
        duration: 0.3,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
      className={`w-full h-full ${className}`}
    >
      {children}
    </motion.div>
  );
}