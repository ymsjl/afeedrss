import { createAppStore, AppState } from './app-store';

const isServer = typeof window === 'undefined';

export let clientStore: ReturnType<typeof createAppStore> | null = null;

export const initializeAppStore = (preloadedState?: Partial<AppState>) => {
  if (isServer) {
    return createAppStore(preloadedState);
  }

  if (!clientStore) {
    clientStore = createAppStore(preloadedState);
  }

  return clientStore;
};
