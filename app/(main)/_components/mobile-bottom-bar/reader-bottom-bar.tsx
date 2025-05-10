import React, { useCallback } from 'react';
import { Button } from '@fluentui/react-components';
import { bundleIcon, ChevronLeft20Regular, Star20Filled, Star20Regular } from '@fluentui/react-icons';
import Swipeout from '@/components/swipe-out';
import { useAppStore } from '@/app/providers/app-store-provider';
import { useStreamContentActions } from '@/features/stream-content/use-stream-content-actions';
import { useStreamContentsQuery } from '@/features/stream-content/use-stream-contents-query';
import { useClasses } from './mobile-bottom-bar.style'; // Assuming you create this style file
import { useArticleReadPanelControl } from '../article-read-panel/article-read-panel-control-context';

const StarIcon = bundleIcon(Star20Filled, Star20Regular);

interface ReaderBottomBarProps {
}

export const ReaderBottomBar = React.memo(({ }: ReaderBottomBarProps) => {
  const classes = useClasses();
  const currentArticle = useAppStore(store => store.currentArticle);
  const setCurrentArticle = useAppStore(store => store.setCurrentArticle);
  const curArticleIndex = useAppStore(store => store.currentArticleIndex);
  const { data: items } = useStreamContentsQuery();
  const { markItemAsStar } = useStreamContentActions();
  const { openArticlePanel, closeArticlePanel } = useArticleReadPanelControl(); // For navigating to next/prev article

  const changePage = useCallback((getPageIndex: (curIndex: number, length: number) => number) => {
    if (curArticleIndex < 0 || !currentArticle) return;
    if (!items || !Array.isArray(items) || items.length === 0) return;
    const nextIndex = getPageIndex(curArticleIndex, items.length);
    const nextArticle = items?.[nextIndex];
    if (nextArticle) {
      openArticlePanel(nextArticle, nextIndex); // Use context to open/navigate
    }
  }, [curArticleIndex, currentArticle, items, openArticlePanel]);

  const onPrev = () => changePage((curIndex) => Math.max(curIndex - 1, 0));

  const onNext = () => changePage((curIndex, length) => Math.min(curIndex + 1, length - 1));

  const onToggleIsStarred = () => {
    currentArticle && markItemAsStar(currentArticle);
  };

  const isArticleStarred = items?.[curArticleIndex]?.isStarred || false;

  let titleDisplay = currentArticle?.title || '';
  const maxLength = 14; // Consider making this configurable or dynamic
  if (titleDisplay.length > maxLength) {
    const halfLength = Math.floor(maxLength / 2);
    titleDisplay = `${titleDisplay.slice(0, halfLength)}...${titleDisplay.slice(-halfLength)}`;
  }

  return (
    <>
      <Button
        size='large'
        icon={<ChevronLeft20Regular />}
        onClick={closeArticlePanel}
      />
      <Swipeout
        className={classes.titleContainer}
        overswipeRatio={0.32}
        leftBtnsProps={[
          {
            text: '上一篇',
            onClick: onPrev
          }
        ]}
        rightBtnsProps={[
          {
            text: '下一篇',
            onClick: onNext
          }
        ]}
      >
        <Button className={classes.title} size="large">{titleDisplay}</Button>
      </Swipeout>
      <Button icon={<StarIcon filled={isArticleStarred} className={isArticleStarred ? classes.highlight : ''} />} onClick={onToggleIsStarred} size='large' />
    </>
  );
});

ReaderBottomBar.displayName = "ReaderBottomBar";