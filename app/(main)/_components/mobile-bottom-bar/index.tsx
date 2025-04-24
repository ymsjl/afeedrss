import React, { useCallback } from 'react';
import { useClasses } from './mobile-bottom-bar.style';
import { useSearchParams, useRouter } from 'next/navigation';
import { useSuspenseQuery } from '@tanstack/react-query';
import { subscriptionsQueryOptions } from '@/server/inoreader/subscription.rquery';
import { useAppStore } from '@/app/providers/app-store-provider';
import { Button, ToggleButton } from '@fluentui/react-components';
import { bundleIcon, ChevronLeft20Regular, Filter20Filled, Filter20Regular, Star20Filled, Star20Regular } from '@fluentui/react-icons'
import Swipeout from '@/components/swipe-out';
import { useStreamContentsQuery } from '@/features/stream-content/use-stream-contents-query';
import { useSearchParamsNavigation } from '../home-page-client/use-search-param-navigation';

const FilterIcon = bundleIcon(Filter20Filled, Filter20Regular);
const StarIcon = bundleIcon(Star20Filled, Star20Regular);

export const MobileBottomBar = React.memo(({ onCloseArticle }: { onCloseArticle: () => void }) => {
  const searchParams = useSearchParams();
  const unreadOnly = !!searchParams.get("unreadOnly");
  const classes = useClasses();
  const router = useRouter();
  const toggleFeedSideNav = useAppStore(store => store.toggleFeedSideNav);
  const isArticlePanelOpen = useAppStore(store => store.isArticlePanelOpen);
  const currentArticle = useAppStore(store => store.currentArticle);
  const setCurrentArticle = useAppStore(store => store.setCurrentArticle);
  const curArticleIndex = useAppStore(store => store.currentArticleIndex);
  const streamId = searchParams.get("streamId");
  const { data } = useSuspenseQuery(subscriptionsQueryOptions);
  const subscription = data?.entities?.subscription?.[streamId!] ?? { title: '全部文章' };
  const { data: items } = useStreamContentsQuery();
  const navigateWithSearch = useSearchParamsNavigation();

  const changePage = useCallback((getPageIndex: (curIndex: number, length: number) => number) => {
    if (curArticleIndex < 0 || !currentArticle) return;
    if (!items || !Array.isArray(items) || items.length === 0) return;
    const nextIndex = getPageIndex(curArticleIndex, items.length);
    const nextArticle = items?.[nextIndex];
    if (nextArticle) {
      setCurrentArticle(nextArticle, nextIndex);
      navigateWithSearch(`/`, { articleId: nextArticle.id });
    }
  }, [curArticleIndex, currentArticle, items, setCurrentArticle, navigateWithSearch]);

  const onPrev = () => changePage((curIndex) => Math.max(curIndex - 1, 0));

  const onNext = () => changePage((curIndex, length) => Math.min(curIndex + 1, length - 1));

  const onToggleUnreadOnly = () => {
    navigateWithSearch('/', { unreadOnly: String(!unreadOnly), })
  };

  const isArticleStarred = true;

  const contentRender = () => {
    if (!isArticlePanelOpen) {
      return (
        <>
          <div className={classes.titleContainer}>
            <Button className={classes.title} onClick={toggleFeedSideNav} size="large">{subscription?.title}</Button>
          </div>
          <ToggleButton icon={<FilterIcon filled={unreadOnly} />} onClick={onToggleUnreadOnly} size='large' />
        </>
      )
    } else {
      const title = currentArticle?.title || '';
      let titleDisplay = title;
      const maxLength = 14;
      if (title.length > maxLength) {
        const halfLength = Math.floor(maxLength / 2);
        titleDisplay = `${title.slice(0, halfLength)}...${title.slice(-halfLength)}`;
      }
      return (
        <>
          <Button
            size='large'
            icon={<ChevronLeft20Regular />}
            onClick={onCloseArticle}
          />
          <Swipeout
            className={classes.titleContainer}
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
          <ToggleButton icon={<StarIcon filled={isArticleStarred} className={classes.starIcon} />} onClick={onToggleUnreadOnly} size='large' />
        </>
      )
    }
  }

  return (
    <div className={classes.root}>
      {contentRender()}
    </div>
  )
})

MobileBottomBar.displayName = "MobileBottomBar";