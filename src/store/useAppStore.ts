import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
  id?: string;
  name: string;
  phone: string;
  email?: string | null;
  isResident: boolean;
  quartier?: string | null;
  referralCode?: string;
  role?: string;
  status?: string;
}

interface Lot {
  id: string;
  name: string;
  block?: string;
  surface: string;
  priceRes: number;
  priceNon: number;
  status: 'AVAILABLE' | 'RESERVED' | 'PAID';
  reservedBy?: string | null;
}

interface Reservation {
  id: string;
  lotId: string;
  lotName: string;
  surface: string;
  paidAmount: number;
  totalPrice: number;
  isResident: boolean;
  status: 'RESERVED' | 'PAID';
}

interface AppState {
  // User state
  currentUser: User | null;
  setCurrentUser: (user: User | null) => void;
  logout: () => void;

  // Navigation state
  currentScreen: string;
  setCurrentScreen: (screen: string) => void;

  // Lots state
  lots: Lot[];
  setLots: (lots: Lot[]) => void;

  // Reservations state
  myReservations: Reservation[];
  setMyReservations: (reservations: Reservation[]) => void;
  addReservation: (reservation: Reservation) => void;

  // Notification state
  congratulationNotification: {
    show: boolean;
    lotName: string;
    lotBlock: string;
  } | null;
  setCongratulationNotification: (notification: { show: boolean; lotName: string; lotBlock: string } | null) => void;

  // UI state
  isMenuOpen: boolean;
  setIsMenuOpen: (open: boolean) => void;
  selectedLot: Lot | null;
  setSelectedLot: (lot: Lot | null) => void;
  isReservationModalOpen: boolean;
  setIsReservationModalOpen: (open: boolean) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      // User state
      currentUser: null,
      setCurrentUser: (user) => set({ currentUser: user }),
      logout: () => set({ currentUser: null, myReservations: [], congratulationNotification: null }),

      // Navigation state
      currentScreen: 'home',
      setCurrentScreen: (screen) => set({ currentScreen: screen }),

      // Lots state
      lots: [],
      setLots: (lots) => set({ lots }),

      // Reservations state
      myReservations: [],
      setMyReservations: (reservations) => set({ myReservations: reservations }),
      addReservation: (reservation) =>
        set((state) => ({
          myReservations: [...state.myReservations, reservation],
        })),

      // Notification state
      congratulationNotification: null,
      setCongratulationNotification: (notification) =>
        set({ congratulationNotification: notification }),

      // UI state
      isMenuOpen: false,
      setIsMenuOpen: (open) => set({ isMenuOpen: open }),
      selectedLot: null,
      setSelectedLot: (lot) => set({ selectedLot: lot }),
      isReservationModalOpen: false,
      setIsReservationModalOpen: (open) =>
        set({ isReservationModalOpen: open }),
    }),
    {
      name: 'kami-extension-storage',
      partialize: (state) => ({
        currentUser: state.currentUser,
        myReservations: state.myReservations,
        congratulationNotification: state.congratulationNotification,
      }),
    }
  )
);
