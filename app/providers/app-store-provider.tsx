'use client';

import { createContext, useContext, useEffect, useRef, useState } from "react";
import { AppState, AppStore, createAppStore } from "@/store/app-store";
import { initializeAppStore } from '@/store/initialize-app-store';
import { useStore } from "zustand";

type AppStoreApi = ReturnType<typeof createAppStore>;

const AppStoreContext = createContext<AppStoreApi | undefined>(undefined);

export function AppStoreProvider({
  children,
  initialState,
}: {
  children: React.ReactNode;
  initialState?: Partial<AppState>;
}) {
  const storeRef = useRef<AppStoreApi | null>(null);

  if (storeRef.current === null) {
    storeRef.current = initializeAppStore(initialState);
  }

  return (
    <AppStoreContext.Provider value={storeRef.current}>
      {children}
    </AppStoreContext.Provider>
  );
}

export function useAppStore<T>(selector: (state: AppStore) => T): T {
  const store = useContext(AppStoreContext);
  if (!store) {
    throw new Error("useAppStore 必须在 AppStoreProvider 内部使用");
  }
  const [isHydrated, setIsHydrated] = useState(false)

  useEffect(() => {
    setIsHydrated(true)
  }, [])

  const selectedState =  useStore(store, selector);

  if(!isHydrated) {
    const initialState = store.getInitialState();
    return selector(initialState)
  }

  return selectedState;
}
