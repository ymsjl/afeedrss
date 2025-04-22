import { createStore } from 'zustand/vanilla';
import { persist, createJSONStorage } from 'zustand/middleware';
import { AppTheme } from '../types';
import { Session } from 'next-auth';
import Cookies from 'js-cookie';

export type LayoutType = 'default' | 'split' | 'compact'

export interface AppState {
  session: Session | null;
  layoutType: LayoutType;
  isMobileSSR: boolean;
  isFeedSideNavOpen: boolean;
  theme: AppTheme;
  preferences: {
    fontSize: number;
    fontFamily: string;
    showUnreadOnly: boolean;
    showFeedThumbnail: boolean;
  };
}

export interface AppActions {
  setSession: (session: Session | null) => void;
  setLayoutType: (type: LayoutType) => void;
  toggleFeedSideNav: () => void;
  setIsFeedSideNavOpen: (open: boolean) => void;
  setTheme: (theme: AppTheme) => void;
  setPreference: <K extends keyof AppState['preferences']>(
    key: K,
    value: AppState['preferences'][K]
  ) => void;
}

export type AppStore = AppState & AppActions

export const defaultInitState: AppState = {
  session: null,
  isMobileSSR: false,
  layoutType: 'default',
  isFeedSideNavOpen: true,
  theme: 'light' as AppTheme,
  preferences: {
    fontSize: 16,
    fontFamily: 'system-ui',
    showUnreadOnly: false,
    showFeedThumbnail: true,
  }
};

const cookiesStorage = {
  getItem: (name: string) => {
    const value = Cookies.get(name);
    return value === undefined ? null : value;
  },
  setItem: (name: string, value: string) => {
    Cookies.set(name, value);
  },
  removeItem: (name: string) => {
    Cookies.remove(name);
  }
}

export const STORAGE_NAME = 'app-storage'

// 重要：不再导出单例 store，而是导出创建 store 的函数
// 这确保在服务器端为每个请求创建新的 store 实例
export const createAppStore = (initState: Partial<AppState> = {}) => {
  return createStore<AppStore>()(
    persist(
      (set) => ({
        ...({ ...defaultInitState, ...initState }),
        setSession: (session) => set({ session }),
        setLayoutType: (type) => set({ layoutType: type }),
        setIsFeedSideNavOpen: (open) => set({ isFeedSideNavOpen: open }),
        toggleFeedSideNav: () => set(({ isFeedSideNavOpen }) => ({ isFeedSideNavOpen: !isFeedSideNavOpen })),
        setTheme: (theme) => set({ theme }),
        setPreference: (key, value) => set((state) => ({
          preferences: {
            ...state.preferences,
            [key]: value,
          }
        })),
      }),
      {
        name: STORAGE_NAME,
        storage: createJSONStorage(() =>
          typeof window === 'undefined' ? {
            getItem: (name: string) => null,
            setItem: (name: string, value: string) => { },
            removeItem: (name: string) => { }
          } : cookiesStorage),
        partialize: (state) => ({
          layoutType: state.layoutType,
          theme: state.theme,
          preferences: state.preferences
        }),
      }
    )
  )
};
