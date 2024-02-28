"use client";

// LIBRARIES
import { create } from "zustand";

export interface UtilsStoreType {
  routerReset: () => void;
  setRouterReset: (router: () => void) => void;
}

const useUtilsStore = create<UtilsStoreType>((set) => ({
  routerReset: () => void null,
  setRouterReset: (router) => {
    set(() => ({
      routerReset: router,
    }));
  },
}));

export default useUtilsStore;
