import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type ThemeMode = 'light' | 'dark';

interface ThemeState {
  mode: ThemeMode;
  toggleMode: () => void;
  setMode: (mode: ThemeMode) => void;
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      mode: 'dark',
      toggleMode: () => {
        const next: ThemeMode = get().mode === 'dark' ? 'light' : 'dark';
        set({ mode: next });
      },
      setMode: (mode) => set({ mode }),
    }),
    { name: 'theme-preference' }
  )
);




