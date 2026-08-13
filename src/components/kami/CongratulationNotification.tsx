'use client';

import { useEffect, useState } from 'react';
import { useAppStore } from '@/store/useAppStore';
import { CheckCircle2, PartyPopper, Home, MapPin, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export function CongratulationNotification() {
  const { congratulationNotification, setCongratulationNotification } = useAppStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || !congratulationNotification?.show) return null;

  const handleClose = () => {
    setCongratulationNotification(null);
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={handleClose}
      >
        <motion.div
          initial={{ scale: 0.5, opacity: 0, y: 50 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.5, opacity: 0, y: 50 }}
          transition={{
            type: 'spring',
            damping: 15,
            stiffness: 200,
          }}
          className="bg-gradient-to-br from-emerald-500 to-emerald-700 rounded-3xl p-8 max-w-md w-full shadow-2xl relative"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close button */}
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 text-white/80 hover:text-white transition-colors"
          >
            <X className="h-6 w-6" />
          </button>

          {/* Animated party poppers */}
          <div className="absolute top-4 left-4">
            <motion.div
              animate={{
                rotate: [0, 360],
                scale: [1, 1.2, 1],
              }}
              transition={{
                rotate: { duration: 2, repeat: Infinity, ease: 'linear' },
                scale: { duration: 0.8, repeat: Infinity, ease: 'easeInOut' },
              }}
            >
              <PartyPopper className="h-12 w-12 text-yellow-300" />
            </motion.div>
          </div>
          <div className="absolute top-4 right-16">
            <motion.div
              animate={{
                rotate: [360, 0],
                scale: [1, 1.2, 1],
              }}
              transition={{
                rotate: { duration: 2.5, repeat: Infinity, ease: 'linear' },
                scale: { duration: 0.8, repeat: Infinity, ease: 'easeInOut', delay: 0.2 },
              }}
            >
              <PartyPopper className="h-10 w-10 text-yellow-200" />
            </motion.div>
          </div>

          {/* Content */}
          <div className="text-center pt-4">
            {/* Check circle with pulse animation */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{
                type: 'spring',
                damping: 10,
                stiffness: 200,
                delay: 0.2,
              }}
              className="mx-auto w-24 h-24 bg-white rounded-full flex items-center justify-center mb-6 shadow-lg"
            >
              <motion.div
                animate={{
                  scale: [1, 1.1, 1],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              >
                <CheckCircle2 className="h-14 w-14 text-emerald-600" />
              </motion.div>
            </motion.div>

            {/* Title */}
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-3xl font-bold text-white mb-4"
            >
              Bravo !
            </motion.h2>

            {/* Message */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="text-white/90 text-lg mb-6"
            >
              Vous avez fini de solder le lot !
            </motion.p>

            {/* Lot info card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="bg-white/20 backdrop-blur-sm rounded-2xl p-6 mb-6"
            >
              <div className="flex items-center justify-center gap-3 mb-4">
                <Home className="h-8 w-8 text-white" />
                <span className="text-white font-bold text-2xl">
                  Lot {congratulationNotification.lotName}
                </span>
              </div>
              <div className="flex items-center justify-center gap-2 text-white/90">
                <MapPin className="h-5 w-5" />
                <span className="text-lg">
                  Îlot {congratulationNotification.lotBlock}
                </span>
              </div>
            </motion.div>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="text-white font-semibold text-xl mb-8"
            >
              Vous appartient désormais !
            </motion.p>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="text-white/80 mb-8"
            >
              Vous pouvez commencer à l'exploiter.
            </motion.p>

            {/* Close button */}
            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleClose}
              className="bg-white text-emerald-700 font-bold py-4 px-8 rounded-2xl shadow-lg hover:shadow-xl transition-all"
            >
              Parfait !
            </motion.button>
          </div>

          {/* Confetti effect */}
          {Array.from({ length: 50 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 rounded-full"
              style={{
                backgroundColor: ['#FFD700', '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4'][i % 5],
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              initial={{
                scale: 0,
                opacity: 1,
                x: 0,
                y: 0,
              }}
              animate={{
                scale: [0, 1, 0],
                opacity: [1, 1, 0],
                x: [0, (Math.random() - 0.5) * 200],
                y: [0, (Math.random() - 0.5) * 200],
                rotate: [0, Math.random() * 720],
              }}
              transition={{
                duration: 2 + Math.random() * 2,
                delay: Math.random() * 0.5,
                ease: 'easeOut',
              }}
            />
          ))}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}