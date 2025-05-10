import React, { useMemo } from 'react';
import { Button } from '@fluentui/react-components';
import { bundleIcon, ChevronLeft20Regular, Star20Filled, Star20Regular } from '@fluentui/react-icons';
import { Swipeout } from '@/components/swipe-out';
import { useAppStore } from '@/app/providers/app-store-provider';
import { useStreamContentActions } from '@/features/stream-content/use-stream-content-actions';
import { useStreamContentsQuery } from '@/features/stream-content/use-stream-contents-query';
import { useClasses } from './mobile-bottom-bar.style'; // Assuming you create this style file
import { useArticleReadPanelControl } from '../article-read-panel/article-read-panel-control-context';
import { useArticleNavigation } from './use-article-navigation';

const StarIcon = bundleIcon(Star20Filled, Star20Regular);

interface ReaderBottomBarProps { }

export const ReaderBottomBar = React.memo(({ }: ReaderBottomBarProps) => {
  const classes = useClasses();
  const currentArticle = useAppStore(store => store.currentArticle);
  const curArticleIndex = useAppStore(store => store.currentArticleIndex);
  const { data: items } = useStreamContentsQuery();
  const { markItemAsStar } = useStreamContentActions();
  const { closeArticlePanel } = useArticleReadPanelControl();
  const { onPrev, onNext } = useArticleNavigation();

  const isArticleStarred = items?.[curArticleIndex]?.isStarred || false;

  const titleDisplay = useMemo(() => {
    let result = currentArticle?.title || '';
    const maxLength = 14; // Consider making this configurable or dynamic
    if (result.length > maxLength) {
      const halfLength = Math.floor(maxLength / 2);
      result = `${result.slice(0, halfLength)}...${result.slice(-halfLength)}`;
    }
    return result;
  }, [currentArticle?.title])

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
      <Button
        icon={<StarIcon filled={isArticleStarred} className={isArticleStarred ? classes.highlight : ''} />}
        disabled={!currentArticle}
        onClick={() => currentArticle && markItemAsStar(currentArticle)}
        size='large'
      />
    </>
  );
});

ReaderBottomBar.displayName = "ReaderBottomBar";