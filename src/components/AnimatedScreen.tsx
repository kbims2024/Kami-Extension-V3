'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { ReactNode, useEffect, useState } from 'react';

interface AnimatedScreenProps {
  children: ReactNode;
  isActive: boolean;
  animationType?: 'fadeIn' | 'slideUp' | 'slideDown' | 'slideLeft' | 'slideRight' | 'scale' | 'bounce' | 'flip' | 'zoom';
  className?: string;
}

const animationVariants: any = {
  fadeIn: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
    transition: { duration: 0.3, ease: 'easeInOut' }
  },
  slideUp: {
    initial: { opacity: 0, y: 60, scale: 0.98 },
    animate: { opacity: 1, y: 0, scale: 1 },
    exit: { opacity: 0, y: -40, scale: 0.98 },
    transition: { type: 'spring', stiffness: 300, damping: 30 }
  },
  slideDown: {
    initial: { opacity: 0, y: -60, scale: 0.98 },
    animate: { opacity: 1, y: 0, scale: 1 },
    exit: { opacity: 0, y: 40, scale: 0.98 },
    transition: { type: 'spring', stiffness: 300, damping: 30 }
  },
  slideLeft: {
    initial: { opacity: 0, x: 60, scale: 0.98 },
    animate: { opacity: 1, x: 0, scale: 1 },
    exit: { opacity: 0, x: -40, scale: 0.98 },
    transition: { type: 'spring', stiffness: 300, damping: 30 }
  },
  slideRight: {
    initial: { opacity: 0, x: -60, scale: 0.98 },
    animate: { opacity: 1, x: 0, scale: 1 },
    exit: { opacity: 0, x: 40, scale: 0.98 },
    transition: { type: 'spring', stiffness: 300, damping: 30 }
  },
  scale: {
    initial: { opacity: 0, scale: 0.9 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 1.05 },
    transition: { type: 'spring', stiffness: 300, damping: 25 }
  },
  bounce: {
    initial: { opacity: 0, scale: 0.3 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 1.1 },
    transition: { type: 'spring', stiffness: 300, damping: 15 }
  },
  flip: {
    initial: { opacity: 0, rotateY: -90, scale: 0.9 },
    animate: { opacity: 1, rotateY: 0, scale: 1 },
    exit: { opacity: 0, rotateY: 90, scale: 0.9 },
    transition: { type: 'spring', stiffness: 200, damping: 25 }
  },
  zoom: {
    initial: { opacity: 0, scale: 0.5 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 1.2 },
    transition: { type: 'spring', stiffness: 200, damping: 20 }
  }
};

export function AnimatedScreen({ children, isActive, animationType = 'slideUp', className = '' }: AnimatedScreenProps) {
  return (
    <AnimatePresence mode="wait">
      {isActive && (
        <motion.div
          initial={animationVariants[animationType].initial}
          animate={animationVariants[animationType].animate}
          exit={animationVariants[animationType].exit}
          transition={animationVariants[animationType].transition as any}
          className={`w-full h-full ${className}`}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// Animated Card Component
interface AnimatedCardProps {
  children: ReactNode;
  delay?: number;
  index?: number;
  className?: string;
  hover?: boolean;
}

export function AnimatedCard({ children, delay = 0, index = 0, className = '', hover = true }: AnimatedCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{
        delay: delay + (index * 0.05),
        type: 'spring',
        stiffness: 300,
        damping: 24
      }}
      whileHover={hover ? { scale: 1.02, y: -5 } : {}}
      whileTap={hover ? { scale: 0.98 } : {}}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// Animated Button Component
interface AnimatedButtonProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  disabled?: boolean;
  variant?: 'default' | 'pulse' | 'bounce';
}

export function AnimatedButton({ children, className = '', onClick, disabled = false, variant = 'default' }: AnimatedButtonProps) {
  const getAnimate = () => {
    if (disabled) return {};
    switch (variant) {
      case 'pulse':
        return { scale: [1, 1.05, 1] };
      case 'bounce':
        return { y: [0, -5, 0] };
      default:
        return {};
    }
  };

  const getTransition = () => {
    if (disabled) return {};
    switch (variant) {
      case 'pulse':
        return { duration: 1.5, repeat: Infinity, ease: 'easeInOut' };
      case 'bounce':
        return { duration: 1, repeat: Infinity, ease: 'easeInOut' };
      default:
        return { type: 'spring', stiffness: 400, damping: 17 };
    }
  };

  return (
      <motion.button
      onClick={onClick}
      disabled={disabled}
      animate={getAnimate()}
      transition={getTransition() as any}
      whileHover={disabled ? {} : { scale: 1.05 }}
      whileTap={disabled ? {} : { scale: 0.95 }}
      className={className}
    >
      {children}
    </motion.button>
  );
}

// Animated List Item
interface AnimatedListItemProps {
  children: ReactNode;
  index: number;
  className?: string;
}

export function AnimatedListItem({ children, index, className = '' }: AnimatedListItemProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{
        delay: index * 0.08,
        type: 'spring',
        stiffness: 300,
        damping: 24
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// Animated Container with staggered children
interface AnimatedContainerProps {
  children: ReactNode;
  className?: string;
  staggerDelay?: number;
}

export function AnimatedContainer({ children, className = '', staggerDelay = 0.1 }: AnimatedContainerProps) {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={{
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: {
            staggerChildren: staggerDelay
          }
        }
      }}
      className={className}
    >
      {React.Children.map(children, (child, index) => (
        <motion.div
          key={index}
          variants={{
            hidden: { opacity: 0, y: 20 },
            visible: { opacity: 1, y: 0 }
          }}
          transition={{
            type: 'spring',
            stiffness: 300,
            damping: 24
          }}
        >
          {child}
        </motion.div>
      ))}
    </motion.div>
  );
}

// Fade In Component
interface FadeInProps {
  children: ReactNode;
  delay?: number;
  duration?: number;
  className?: string;
}

export function FadeIn({ children, delay = 0, duration = 0.5, className = '' }: FadeInProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay, duration, ease: 'easeOut' }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// Scale In Component
interface ScaleInProps {
  children: ReactNode;
  delay?: number;
  className?: string;
}

export function ScaleIn({ children, delay = 0, className = '' }: ScaleInProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{
        delay,
        type: 'spring',
        stiffness: 200,
        damping: 20
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// Slide In Component
interface SlideInProps {
  children: ReactNode;
  delay?: number;
  direction?: 'left' | 'right' | 'up' | 'down';
  className?: string;
}

export function SlideIn({ children, delay = 0, direction = 'left', className = '' }: SlideInProps) {
  const getInitial = () => {
    switch (direction) {
      case 'left': return { opacity: 0, x: -50 };
      case 'right': return { opacity: 0, x: 50 };
      case 'up': return { opacity: 0, y: 50 };
      case 'down': return { opacity: 0, y: -50 };
    }
  };

  return (
    <motion.div
      initial={getInitial()}
      animate={{ opacity: 1, x: 0, y: 0 }}
      transition={{
        delay,
        type: 'spring',
        stiffness: 300,
        damping: 24
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// Pulse Animation
export function Pulse({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <motion.div
      animate={{
        scale: [1, 1.05, 1],
        opacity: [1, 0.8, 1]
      }}
      transition={{
        duration: 2,
        repeat: Infinity,
        ease: 'easeInOut'
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// Float Animation
export function Float({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <motion.div
      animate={{
        y: [-5, 5, -5]
      }}
      transition={{
        duration: 3,
        repeat: Infinity,
        ease: 'easeInOut'
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

import React from 'react';

// Shimmer Loading Effect
export function Shimmer({ className = '', width = '100%', height = '100%' }: { className?: string; width?: string; height?: string }) {
  return (
    <motion.div
      className={`bg-muted ${className}`}
      style={{ width, height }}
      animate={{
        opacity: [0.4, 0.7, 0.4]
      }}
      transition={{
        duration: 1.5,
        repeat: Infinity,
        ease: 'easeInOut'
      }}
    />
  );
}