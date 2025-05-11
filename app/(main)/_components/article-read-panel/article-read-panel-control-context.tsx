'use client'

import React, { createContext, useCallback, useContext, PropsWithChildren } from 'react';
import { useAppStore } from '@/app/providers/app-store-provider';
import { useSearchParamNavigation } from '@utils/use-search-param-navigation';
import { StreamContentItemWithPageIndex } from '@/features/stream-content/use-stream-contents-query';
import { useStateChangeEffect } from '@/utils/use-state-change-effect';
import { useSearchParams } from 'next/navigation';

interface ArticleReadPanelControlContextType {
  openArticlePanel: (item: StreamContentItemWithPageIndex, index: number) => void;
  closeArticlePanel: () => void;
}

const ArticleReadPanelControlContext = createContext<ArticleReadPanelControlContextType | undefined>(undefined);

export const ArticleReadPanelControlProvider: React.FC<PropsWithChildren<{}>> = ({ children }) => {
  const searchParams = useSearchParams();
  const openArticleInReadingPanelStore = useAppStore(store => store.openArticleInReadingPanel);
  const closeArticlePanelStore = useAppStore(store => store.closeArticlePanel);

  const navigateWithSearch = useSearchParamNavigation();

  const openArticlePanel = useCallback(
    (item: StreamContentItemWithPageIndex, index: number) => {
      openArticleInReadingPanelStore(item, index);
      navigateWithSearch('/', { articleId: item.id });
    },
    [openArticleInReadingPanelStore, navigateWithSearch]
  );

  const closeArticlePanel = useCallback(() => {
    closeArticlePanelStore();
    navigateWithSearch('/', { articleId: null });
  }, [closeArticlePanelStore, navigateWithSearch]);

  useStateChangeEffect(searchParams.get('streamId'), closeArticlePanel)

  useStateChangeEffect(searchParams.get('articleId'), (prevArticleId, currentArticleId) => {
    if (prevArticleId && !currentArticleId) {
      closeArticlePanelStore();
    }
  })

  return (
    <ArticleReadPanelControlContext.Provider value={{ openArticlePanel, closeArticlePanel }}>
      {children}
    </ArticleReadPanelControlContext.Provider>
  );
};

export const useArticleReadPanelControl = () => {
  const context = useContext(ArticleReadPanelControlContext);
  if (context === undefined) {
    throw new Error('useArticleReadPanelControl must be used within an ArticleReadPanelControlProvider');
  }
  return context;
};