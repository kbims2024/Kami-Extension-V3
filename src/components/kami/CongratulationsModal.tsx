'use client';

import { useEffect, useState } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Trophy, Sparkles, PartyPopper } from 'lucide-react';

interface CongratulationsModalProps {
  isOpen: boolean;
  onClose: () => void;
  lotName: string;
  lotBlock: string;
}

export function CongratulationsModal({ isOpen, onClose, lotName, lotBlock }: CongratulationsModalProps) {
  const [animationStep, setAnimationStep] = useState(0);

  useEffect(() => {
    if (isOpen) {
      setAnimationStep(0);
      const steps = [300, 600, 900, 1200, 1500, 1800];

      steps.forEach((delay, index) => {
        setTimeout(() => {
          setAnimationStep(index + 1);
        }, delay);
      });
    }
  }, [isOpen]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md p-0 overflow-hidden border-none shadow-2xl">
        <div className="relative bg-gradient-to-br from-[#8B5E3C] to-[#6B472C] text-white p-8 text-center min-h-[400px] flex flex-col items-center justify-center">
          {/* Animated Background Particles */}
          <div className="absolute inset-0 overflow-hidden">
            {[...Array(6)].map((_, i) => (
              <Sparkles
                key={i}
                className={`absolute text-yellow-300 opacity-0 ${
                  animationStep >= 1 ? 'animate-pulse' : ''
                }`}
                style={{
                  animationDelay: `${i * 0.2}s`,
                  top: `${10 + Math.random() * 80}%`,
                  left: `${10 + Math.random() * 80}%`,
                  fontSize: `${20 + Math.random() * 20}px`,
                }}
              />
            ))}
          </div>

          {/* Trophy Icon with animation */}
          <div
            className={`relative mb-6 transition-all duration-700 ${
              animationStep >= 1 ? 'scale-110 opacity-100' : 'scale-0 opacity-0'
            }`}
          >
            <Trophy className="w-24 h-24 text-yellow-400" />
            <div className="absolute -top-2 -right-2">
              <PartyPopper className="w-8 h-8 text-yellow-300 animate-bounce" />
            </div>
          </div>

          {/* Congratulation Text */}
          <h2
            className={`text-3xl font-extrabold mb-4 transition-all duration-700 ${
              animationStep >= 2 ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
            }`}
          >
            BRAVO !
          </h2>

          {/* Main Message */}
          <div
            className={`bg-white/10 backdrop-blur-sm rounded-xl p-4 mb-4 transition-all duration-700 ${
              animationStep >= 3 ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
            }`}
          >
            <p className="text-lg font-semibold mb-2">
              Vous avez fini de solder le lot {lotName}
            </p>
            <p className="text-sm opacity-90">
              de l'îlot {lotBlock}
            </p>
          </div>

          {/* Success Message */}
          <p
            className={`text-base font-medium mb-6 transition-all duration-700 ${
              animationStep >= 4 ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
            }`}
          >
            Vous appartient désormais !
          </p>

          {/* Action Button */}
          <button
            onClick={onClose}
            className={`bg-white text-[#8B5E3C] font-bold py-3 px-8 rounded-full hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 shadow-lg ${
              animationStep >= 5 ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
            }`}
          >
            C'est parti ! 🚀
          </button>

          {/* Confetti Effect */}
          {animationStep >= 5 && (
            <div className="absolute inset-0 pointer-events-none">
              {[...Array(10)].map((_, i) => (
                <div
                  key={i}
                  className="absolute w-2 h-2 rounded-full animate-bounce"
                  style={{
                    backgroundColor: ['#FFD700', '#FF6B6B', '#4ECDC4', '#95E1D3', '#F38181'][i % 5],
                    top: `${10 + (i * 8)}%`,
                    left: `${10 + (i * 9)}%`,
                    animationDelay: `${i * 0.1}s`,
                  }}
                />
              ))}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}