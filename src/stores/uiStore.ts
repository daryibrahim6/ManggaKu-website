import { create } from 'zustand'

interface UIStore {
  isCartOpen: boolean
  toggleCart: () => void
  isMobileNavOpen: boolean
  toggleMobileNav: () => void
}

export const useUIStore = create<UIStore>((set) => ({
  isCartOpen: false,
  toggleCart: () => set((s) => ({ isCartOpen: !s.isCartOpen })),
  isMobileNavOpen: false,
  toggleMobileNav: () => set((s) => ({ isMobileNavOpen: !s.isMobileNavOpen })),
}))
