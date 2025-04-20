'use client';

import { createContext, useContext, useRef } from "react";
import { AppState, createAppStore, initializeAppStore } from "@/store/appStore";
import { useStore } from "zustand";

// 明确定义 store API 类型
export type AppStoreApi = ReturnType<typeof createAppStore>;

// 创建上下文，初始值为 undefined
export const AppStoreContext = createContext<AppStoreApi | undefined>(undefined);

// 使用 store 的 hook
export function useAppStore<T>(selector: (state: AppState) => T): T {
  const store = useContext(AppStoreContext);
  if (!store) {
    throw new Error("useAppStore 必须在 AppStoreProvider 内部使用");
  }

  return useStore(store, selector);
}

// Provider 组件
export function AppStoreProvider({
  children,
  initialState,
}: {
  children: React.ReactNode;
  initialState?: Partial<AppState>;
}) {
  // 使用 useRef 确保只创建一次 store
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
