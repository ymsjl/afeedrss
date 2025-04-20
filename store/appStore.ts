import { createStore as createZustandStore } from 'zustand/vanilla';
import { persist, createJSONStorage } from 'zustand/middleware';
import { AppTheme } from '../types';
import { Session } from 'next-auth';

export type LayoutType = 'default' | 'split' | 'compact'
// 定义应用状态类型

export interface AppState {
  // 用户会话状态
  session: Session | null;
  setSession: (session: Session | null) => void;

  // 布局相关状态
  layoutType: LayoutType;
  setLayoutType: (type: LayoutType) => void;

  // 文章面板状态
  isArticlePanelOpen: boolean;
  setArticlePanelOpen: (open: boolean) => void;

  // 主题状态
  theme: AppTheme;
  setTheme: (theme: AppTheme) => void;

  // 用户首选项
  preferences: {
    fontSize: number;
    fontFamily: string;
    showUnreadOnly: boolean;
    showFeedThumbnail: boolean;
  };
  setPreference: <K extends keyof AppState['preferences']>(
    key: K,
    value: AppState['preferences'][K]
  ) => void;
}

// 默认初始状态
export const defaultInitState: Partial<AppState> = {
  session: null,
  layoutType: 'default',
  isArticlePanelOpen: false,
  theme: 'light' as AppTheme,
  preferences: {
    fontSize: 16,
    fontFamily: 'system-ui',
    showUnreadOnly: false,
    showFeedThumbnail: true,
  }
};

// 重要：不再导出单例 store，而是导出创建 store 的函数
// 这确保在服务器端为每个请求创建新的 store 实例
export const createAppStore = (initState: Partial<AppState> = defaultInitState) =>
  createZustandStore<AppState>()(
    persist(
      (set) => ({
        // 用户会话状态
        session: null,
        setSession: (session) => set({ session }),

        // 默认状态
        layoutType: 'default',
        setLayoutType: (type) => set({ layoutType: type }),

        isArticlePanelOpen: false,
        setArticlePanelOpen: (open) => set({ isArticlePanelOpen: open }),

        theme: 'light' as AppTheme,
        setTheme: (theme) => set({ theme }),

        preferences: {
          fontSize: 16,
          fontFamily: 'system-ui',
          showUnreadOnly: false,
          showFeedThumbnail: true
        },
        setPreference: (key, value) => set((state) => ({
          preferences: {
            ...state.preferences,
            [key]: value,
          }
        })),

        // 应用预加载状态（如果有）
        ...initState
      }),
      {
        name: 'app-storage', // localStorage 中的键名
        storage: createJSONStorage(() => (typeof window !== 'undefined' ? localStorage : {
          getItem: () => null,
          setItem: () => {},
          removeItem: () => {},
        })),
        // 你可以选择只持久化某些状态
        partialize: (state) => ({
          layoutType: state.layoutType,
          theme: state.theme,
          preferences: state.preferences
        }),
      }
    )
  );

// 确定当前环境
const isServer = typeof window === 'undefined';

// 客户端全局实例
export let clientStore: ReturnType<typeof createAppStore> | null = null;

// 初始化 store 的函数
export const initializeAppStore = (preloadedState?: Partial<AppState>) => {
  // 总是在服务器端创建新的 store
  if (isServer) {
    return createAppStore(preloadedState);
  }

  // 客户端仅创建一次
  if (!clientStore) {
    clientStore = createAppStore(preloadedState);
  }

  return clientStore;
};
