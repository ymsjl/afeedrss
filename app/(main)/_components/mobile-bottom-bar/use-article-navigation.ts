import { useCallback } from 'react';
import { useAppStore } from '@/app/providers/app-store-provider';
import { useStreamContentsQuery } from '@/features/stream-content/use-stream-contents-query';
import { useArticleReadPanelControl } from '../article-read-panel';

export function useArticleNavigation() {
  const currentArticle = useAppStore(store => store.currentArticle);
  const curArticleIndex = useAppStore(store => store.currentArticleIndex);
  const { data: items } = useStreamContentsQuery();
  const { openArticlePanel } = useArticleReadPanelControl();

  const changePage = useCallback((getPageIndex: (curIndex: number, length: number) => number) => {
    if (curArticleIndex < 0 || !currentArticle) return;
    if (!items || !Array.isArray(items) || items.length === 0) return;
    const nextIndex = getPageIndex(curArticleIndex, items.length);
    const nextArticle = items?.[nextIndex];
    if (nextArticle) {
      openArticlePanel(nextArticle, nextIndex);
    }
  }, [curArticleIndex, currentArticle, items, openArticlePanel]);

  const onPrev = () => changePage((curIndex) => Math.max(curIndex - 1, 0));

  const onNext = () => changePage((curIndex, length) => Math.min(curIndex + 1, length - 1));

  return { onPrev, onNext };
}
