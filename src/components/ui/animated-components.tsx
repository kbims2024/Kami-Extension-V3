'use client';

import { ReactNode } from 'react';
import { motion } from 'framer-motion';

interface AnimatedCardProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  index?: number;
  hover?: boolean;
}

export function AnimatedCard({ children, className = '', delay = 0, index = 0, hover = true }: AnimatedCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.4,
        delay: delay + index * 0.05,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
      className={className}
      whileHover={hover ? { scale: 1.02, y: -4 } : {}}
      whileTap={hover ? { scale: 0.98 } : {}}
    >
      {children}
    </motion.div>
  );
}

interface AnimatedButtonProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  onClick?: () => void;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
}

export function AnimatedButton({ children, className = '', delay = 0, onClick, disabled, type = 'button' }: AnimatedButtonProps) {
  return (
    <motion.button
      type={type}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{
        duration: 0.3,
        delay,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className={className}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </motion.button>
  );
}

interface AnimatedListItemProps {
  children: ReactNode;
  className?: string;
  index?: number;
  direction?: 'left' | 'right' | 'up' | 'down';
}

const listItemVariants = {
  left: {
    initial: { opacity: 0, x: -30 },
    animate: { opacity: 1, x: 0 },
  },
  right: {
    initial: { opacity: 0, x: 30 },
    animate: { opacity: 1, x: 0 },
  },
  up: {
    initial: { opacity: 0, y: 30 },
    animate: { opacity: 1, y: 0 },
  },
  down: {
    initial: { opacity: 0, y: -30 },
    animate: { opacity: 1, y: 0 },
  },
};

export function AnimatedListItem({ children, className = '', index = 0, direction = 'left' }: AnimatedListItemProps) {
  const variant = listItemVariants[direction];

  return (
    <motion.div
      initial={variant.initial}
      animate={variant.animate}
      transition={{
        duration: 0.4,
        delay: index * 0.1,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

interface AnimatedContainerProps {
  children: ReactNode;
  className?: string;
  staggerDelay?: number;
}

export function AnimatedContainer({ children, className = '', staggerDelay = 0.08 }: AnimatedContainerProps) {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={{
        hidden: {},
        visible: {
          transition: {
            staggerChildren: staggerDelay,
          },
        },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

interface AnimatedContainerItemProps {
  children: ReactNode;
  className?: string;
  direction?: 'up' | 'down' | 'fade' | 'scale';
}

const containerItemVariants = {
  up: {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  },
  down: {
    hidden: { opacity: 0, y: -20 },
    visible: { opacity: 1, y: 0 },
  },
  fade: {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  },
  scale: {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { opacity: 1, scale: 1 },
  },
};

export function AnimatedContainerItem({ children, className = '', direction = 'up' }: AnimatedContainerItemProps) {
  const variant = containerItemVariants[direction];

  return (
    <motion.div
      variants={variant}
      transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

interface PulseAnimationProps {
  children: ReactNode;
  className?: string;
  intensity?: number;
}

export function PulseAnimation({ children, className = '', intensity = 1 }: PulseAnimationProps) {
  return (
    <motion.div
      animate={{
        scale: [1, 1 + (0.02 * intensity), 1],
      }}
      transition={{
        duration: 2,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

interface ShimmerEffectProps {
  children: ReactNode;
  className?: string;
}

export function ShimmerEffect({ children, className = '' }: ShimmerEffectProps) {
  return (
    <motion.div
      className={className}
      whileHover={{
        backgroundPosition: ['200% center', '0% center'],
      }}
      transition={{
        duration: 1,
        ease: 'linear',
      }}
    >
      {children}
    </motion.div>
  );
}