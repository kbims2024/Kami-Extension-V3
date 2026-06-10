import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { ThemeToggle } from '@/components/theme-toggle';
import { Home, Map, FileText, Wallet, User, Shield, LogOut, LogIn, Building2, X, Settings } from 'lucide-react';

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
    { icon: Wallet, label: 'Mes réservations', screen: 'dashboard' },
    { icon: User, label: 'Mon profil', screen: 'profile' },
    { icon: FileText, label: 'Règlement intérieur', screen: 'rules' },
  ];

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 transition-opacity animate-fade-in"
          onClick={onClose}
        />
      )}

      {/* Menu */}
      <div
        className={`fixed top-0 left-0 h-full w-80 bg-background z-50 shadow-2xl transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="bg-gradient-to-br from-blue-600 to-blue-800 dark:from-blue-700 dark:to-blue-900 p-6 text-white relative">
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="absolute top-4 right-4 hover:bg-card/10 text-white"
          >
            <X className="h-5 w-5" />
          </Button>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-card/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
              <Building2 className="h-6 w-6 text-yellow-400" />
            </div>
            <div>
              <h2 className="text-lg font-bold">KAMI-EXTENSION</h2>
              <p className="text-xs text-blue-200">Plateforme de réservation</p>
            </div>
          </div>

          {currentUser ? (
            <div className="bg-card/10 rounded-xl p-3 backdrop-blur-sm border border-white/20">
              <p className="text-xs text-blue-200 mb-1">Connecté en tant que</p>
              <p className="font-semibold">{currentUser.name}</p>
              <p className="text-xs text-yellow-400 mt-1">
                {currentUser.isResident ? 'Résident KAMI' : 'Non-Résident'}
              </p>
            </div>
          ) : (
            <div className="bg-card/10 rounded-xl p-3 backdrop-blur-sm border border-white/20">
              <p className="text-sm text-blue-100">
                Connectez-vous pour réserver votre terrain
              </p>
            </div>
          )}
        </div>

        {/* Menu Items */}
        <div className="flex-1 overflow-y-auto py-4">
          <nav className="space-y-1 px-3">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <Button
                  key={item.screen}
                  variant="ghost"
                  className="w-full justify-start px-4 py-3 h-auto text-foreground hover:bg-accent hover:text-accent-foreground rounded-xl transition-all group"
                  onClick={() => {
                    onNavigate(item.screen);
                    onClose();
                  }}
                >
                  <Icon className="mr-3 h-5 w-5 transition-colors" />
                  <span className="font-medium">{item.label}</span>
                </Button>
              );
            })}
          </nav>

          <Separator className="my-4" />

          <div className="px-3 space-y-1">
            <Button
              variant="ghost"
              className="w-full justify-start px-4 py-3 h-auto text-foreground hover:bg-accent hover:text-accent-foreground rounded-xl transition-all group"
              onClick={() => {
                onNavigate('settings');
                onClose();
              }}
            >
              <Settings className="mr-3 h-5 w-5 transition-colors" />
              <span className="font-medium">Paramètres</span>
            </Button>

            <Button
              variant="ghost"
              className="w-full justify-start px-4 py-3 h-auto text-foreground hover:bg-red-50 dark:hover:bg-red-950 hover:text-red-600 dark:hover:text-red-400 rounded-xl transition-all group"
              onClick={() => {
                onNavigate('admin');
                onClose();
              }}
            >
              <Shield className="mr-3 h-5 w-5 group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors" />
              <span className="font-medium">Administration</span>
            </Button>

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
              {currentUser ? (
                <>
                  <LogOut className="mr-3 h-5 w-5 transition-colors" />
                  <span className="font-medium">Déconnexion</span>
                </>
              ) : (
                <>
                  <LogIn className="mr-3 h-5 w-5 transition-colors" />
                  <span className="font-medium">Connexion</span>
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-border bg-muted">
          <p className="text-xs text-center text-muted-foreground">
            © 2024 KAMI-EXTENSION
          </p>
        </div>
      </div>
    </>
  );
}
