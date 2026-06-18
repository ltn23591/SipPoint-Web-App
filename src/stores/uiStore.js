import { create } from "zustand";

export const useUiStore = create((set) => ({
  mobileNavOpen: false,
  setMobileNavOpen: (value) => set({ mobileNavOpen: !!value }),
  toggleMobileNav: () =>
    set((state) => ({ mobileNavOpen: !state.mobileNavOpen })),
}));
