'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Home, Map, FileText, Wallet, User, Shield, LogOut, LogIn, Building2, X, Settings, MessageSquare, Users, Headset } from 'lucide-react';

interface ModernSideMenuProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: any;
  onNavigate: (screen: string) => void;
  onLogout: () => void;
}

export function ModernSideMenu({ isOpen, onClose, currentUser, onNavigate, onLogout }: ModernSideMenuProps) {
  const menuItems = [
    { icon: Home, label: 'Accueil', screen: 'home' },
    { icon: Map, label: 'Plan des lots', screen: 'map' },
    { icon: Wallet, label: 'Mes réservations', screen: 'dashboard', requireAuth: true },
    { icon: MessageSquare, label: 'Discussions', screen: 'chat', requireAuth: true },
    { icon: Users, label: 'Comité de Gestion des Lots', screen: 'management-committee', requireAuth: true, isAdminOnly: true },
    { icon: User, label: 'Mon profil', screen: 'profile', requireAuth: true },
    { icon: FileText, label: 'Règlement intérieur', screen: 'rules' },
    { icon: Headset, label: 'Service après-vente', screen: 'sav' },
  ];

  return (
    <AnimatePresence>
      {/* Overlay */}
      {isOpen && (
        <motion.div
          key="overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 bg-black/50 z-40"
          onClick={onClose}
        />
      )}

      {/* Menu */}
      <motion.div
        key="menu"
        initial={{ x: '-100%' }}
        animate={{ x: isOpen ? '0%' : '-100%' }}
        exit={{ x: '-100%' }}
        transition={{
          type: 'spring',
          stiffness: 300,
          damping: 30,
        }}
        className="fixed top-0 left-0 h-full w-80 bg-background z-50 shadow-2xl"
      >
        {/* Header */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1, duration: 0.3 }}
          className="bg-gradient-to-br from-blue-600 to-blue-800 dark:from-blue-700 dark:to-blue-900 p-6 text-white relative"
        >
          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="absolute top-4 right-4 hover:bg-card/10 text-white"
            >
              <X className="h-5 w-5" />
            </Button>
          </motion.div>
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 300 }}
            className="flex items-center gap-3 mb-4"
          >
            <motion.div
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.6 }}
              className="w-12 h-12 bg-card/20 rounded-xl flex items-center justify-center backdrop-blur-sm"
            >
              <Building2 className="h-6 w-6 text-yellow-400" />
            </motion.div>
            <div>
              <motion.h2
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-lg font-bold"
              >
                KAMI-EXTENSION
              </motion.h2>
              <motion.p
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="text-xs text-blue-200"
              >
                Plateforme de réservation
              </motion.p>
            </div>
          </motion.div>

          <AnimatePresence mode="wait">
            {currentUser ? (
              <motion.div
                key="user-info"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -20, opacity: 0 }}
                transition={{ delay: 0.5, duration: 0.3 }}
                className="bg-card/10 rounded-xl p-3 backdrop-blur-sm border border-white/20"
              >
                <p className="text-xs text-blue-200 mb-1">Connecté en tant que</p>
                <p className="font-semibold">{currentUser.name}</p>
                <p className="text-xs text-yellow-400 mt-1">
                  {currentUser.isResident ? 'Résident KAMI' : 'Non-Résident'}
                </p>
              </motion.div>
            ) : (
              <motion.div
                key="login-prompt"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -20, opacity: 0 }}
                transition={{ delay: 0.5, duration: 0.3 }}
                className="bg-card/10 rounded-xl p-3 backdrop-blur-sm border border-white/20"
              >
                <p className="text-sm text-blue-100">
                  Connectez-vous pour réserver votre terrain
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Menu Items */}
        <div className="flex-1 overflow-y-auto py-4">
          <nav className="space-y-1 px-3">
            {menuItems.map((item, index) => {
              const Icon = item.icon;
              if ('requireAuth' in item && item.requireAuth && !currentUser) {
                return null;
              }
              if ('isAdminOnly' in item && item.isAdminOnly && (!currentUser || !currentUser.isAdmin)) {
                return null;
              }
              return (
                <motion.div
                  key={item.screen}
                  initial={{ x: -50, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.6 + index * 0.05, duration: 0.3 }}
                >
                  <motion.div
                    whileHover={{ scale: 1.02, x: 4 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Button
                      variant="ghost"
                      className="w-full justify-start px-4 py-3 h-auto text-foreground hover:bg-accent hover:text-accent-foreground rounded-xl transition-all group"
                      onClick={() => {
                        onNavigate(item.screen);
                        onClose();
                      }}
                    >
                      <motion.div
                        whileHover={{ rotate: 5 }}
                        transition={{ type: 'spring', stiffness: 300 }}
                        className="mr-3"
                      >
                        <Icon className="h-5 w-5 transition-colors" />
                      </motion.div>
                      <span className="font-medium">{item.label}</span>
                    </Button>
                  </motion.div>
                </motion.div>
              );
            })}
          </nav>

          <Separator className="my-4" />

          <div className="px-3 space-y-1">
            <motion.div
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 1.1, duration: 0.3 }}
            >
              <motion.div
                whileHover={{ scale: 1.02, x: 4 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button
                  variant="ghost"
                  className="w-full justify-start px-4 py-3 h-auto text-foreground hover:bg-accent hover:text-accent-foreground rounded-xl transition-all group"
                  onClick={() => {
                    onNavigate('settings');
                    onClose();
                  }}
                >
                  <motion.div
                    whileHover={{ rotate: 5 }}
                    transition={{ type: 'spring', stiffness: 300 }}
                    className="mr-3"
                  >
                    <Settings className="mr-3 h-5 w-5 transition-colors" />
                  </motion.div>
                  <span className="font-medium">Paramètres</span>
                </Button>
              </motion.div>
            </motion.div>

            {currentUser?.role === 'ADMIN' && (
              <motion.div
                initial={{ x: -50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 1.15, duration: 0.3 }}
              >
                <motion.div
                  whileHover={{ scale: 1.02, x: 4 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button
                    variant="ghost"
                    className="w-full justify-start px-4 py-3 h-auto text-foreground hover:bg-red-50 dark:hover:bg-red-950 hover:text-red-600 dark:hover:text-red-400 rounded-xl transition-all group"
                    onClick={() => {
                      onNavigate('admin');
                      onClose();
                    }}
                  >
                    <motion.div
                      whileHover={{ rotate: 5 }}
                      transition={{ type: 'spring', stiffness: 300 }}
                      className="mr-3"
                    >
                      <Shield className="mr-3 h-5 w-5 group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors" />
                    </motion.div>
                    <span className="font-medium">Administration</span>
                  </Button>
                </motion.div>
              </motion.div>
            )}

            <motion.div
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 1.2, duration: 0.3 }}
            >
              <motion.div
                whileHover={{ scale: 1.02, x: 4 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button
                  variant="ghost"
                  className="w-full justify-start px-4 py-3 h-auto text-foreground hover:bg-accent hover:text-accent-foreground rounded-xl transition-all group"
                  onClick={() => {
                    if (currentUser) {
                      onLogout();
                    } else {
                      onNavigate('login');
                    }
                    onClose();
                  }}
                >
                  <motion.div
                    whileHover={{ rotate: 5 }}
                    transition={{ type: 'spring', stiffness: 300 }}
                    className="mr-3"
                  >
                    {currentUser ? (
                      <LogOut className="mr-3 h-5 w-5 transition-colors" />
                    ) : (
                      <LogIn className="mr-3 h-5 w-5 transition-colors" />
                    )}
                  </motion.div>
                  <span className="font-medium">
                    {currentUser ? 'Déconnexion' : 'Connexion'}
                  </span>
                </Button>
              </motion.div>
            </motion.div>
          </div>
        </div>

        {/* Footer */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 1.3, duration: 0.3 }}
          className="p-4 border-t border-border bg-muted"
        >
          <p className="text-xs text-center text-muted-foreground">
            © 2024 KAMI-EXTENSION
          </p>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}