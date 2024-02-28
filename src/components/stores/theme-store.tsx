"use client";

// LIBRARIES
import { create } from "zustand";

// UTILS
import { COLOR_THEMES, type ColorTheme } from "~/server/db/schema";

export interface ThemeStoreType {
  colorTheme: ColorTheme;
  setColorTheme: (colorTheme: ColorTheme) => void;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  themeList: ColorTheme[];
  toggleDrawer: () => void;
}

const useThemeStore = create<ThemeStoreType>((set, get) => ({
  colorTheme: "galaxy",
  setColorTheme: (colorTheme) => {
    set(() => ({
      colorTheme,
    }));
    window.localStorage.setItem("theme", colorTheme);
  },
  isOpen: false,
  setIsOpen: (isOpen) => {
    set(() => ({
      isOpen,
    }));
  },
  themeList: [...COLOR_THEMES],
  toggleDrawer: () => {
    set(() => ({
      isOpen: !get().isOpen,
    }));
  },
}));

export default useThemeStore;
