import { createStore } from 'zustand/vanilla';
import { persist, createJSONStorage } from 'zustand/middleware';
import { Session } from 'next-auth';
import Cookies from 'js-cookie';
import { StreamContentItemWithPageIndex } from "@/features/stream-content/use-stream-contents-query";

export type AppTheme = 'light' | 'dark';

export type HomePageLayoutType = 'default' | 'split'
export type StreamItemDisplayType = 'default' | 'pictureOnBottom' | 'textOnly' | 'grid'

export interface AppState {
  session: Session | null;
  homePageLayoutType: HomePageLayoutType;
  streamItemDisplayType: StreamItemDisplayType;
  isMobileSSR: boolean;
  isFeedSideNavOpen: boolean;
  isArticlePanelOpen: boolean;
  articleListScrollPage: number;
  currentArticle: StreamContentItemWithPageIndex | null;
  currentArticleIndex: number;
  theme: AppTheme;
  preferences: {
    fontSize: number;
    fontFamily: string;
    showUnreadOnly: boolean;
  };
}

export interface AppActions {
  setSession: (session: Session | null) => void;
  setHomePageLayoutType: (type: HomePageLayoutType) => void;
  setStreamItemDisplayType: (type: StreamItemDisplayType) => void;
  toggleHomePageLayoutType: () => void;
  setIsArticlePanelOpen: (open: boolean) => void;
  setCurrentArticle: (article: StreamContentItemWithPageIndex | null, index: number) => void;
  toggleFeedSideNav: () => void;
  articleListPageChange: (n: number) => void;
  setIsFeedSideNavOpen: (open: boolean) => void;
  openArticleInReadingPanel: (article: StreamContentItemWithPageIndex, index: number) => void;
  closeArticlePanel: () => void;
  toggleTheme: () => void;
  setPreference: <K extends keyof AppState['preferences']>(
    key: K,
    value: AppState['preferences'][K]
  ) => void;
  getArticleIsSelected: (id: string) => boolean
}

export type AppStore = AppState & AppActions

export const defaultInitState: AppState = {
  session: null,
  isMobileSSR: false,
  homePageLayoutType: 'default',
  streamItemDisplayType: 'default',
  isFeedSideNavOpen: false,
  isArticlePanelOpen: false,
  articleListScrollPage: 0,
  currentArticle: null,
  currentArticleIndex: -1,
  theme: 'light' as AppTheme,
  preferences: {
    fontSize: 16,
    fontFamily: 'system-ui',
    showUnreadOnly: false,
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
      (set, get) => ({
        ...({ ...defaultInitState, ...initState }),
        setSession: (session) => set({ session }),
        setHomePageLayoutType: (type) => set({ homePageLayoutType: type }),
        setStreamItemDisplayType: (type) => set({ streamItemDisplayType: type }),
        toggleHomePageLayoutType: () => set({ homePageLayoutType: get().homePageLayoutType === 'default' ? 'split' : 'default' }),
        setIsArticlePanelOpen: (open) => set({ isArticlePanelOpen: open }),
        articleListPageChange: (direct: number) => set({ articleListScrollPage: get().articleListScrollPage + direct }),
        setCurrentArticle: (article, index) => set({ currentArticle: article, currentArticleIndex: index }),
        openArticleInReadingPanel: (article, index) => set({ isArticlePanelOpen: true, currentArticle: article, currentArticleIndex: index }),
        closeArticlePanel: () => {
          set({ isArticlePanelOpen: false });
          setTimeout(() => {
            set({ currentArticle: null, currentArticleIndex: -1 });
          }, 300);
        },
        getArticleIsSelected: (id) => get().currentArticle?.id === id,
        setIsFeedSideNavOpen: (open) => set({ isFeedSideNavOpen: open }),
        toggleFeedSideNav: () => set(({ isFeedSideNavOpen }) => ({ isFeedSideNavOpen: !isFeedSideNavOpen })),
        toggleTheme: () => set({ theme: get().theme === 'light' ? 'dark' : 'light' }),
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
          streamItemDisplayType: state.streamItemDisplayType,
          homePageLayoutType: state.homePageLayoutType,
          theme: state.theme,
          preferences: state.preferences
        }),
      }
    )
  )
};
