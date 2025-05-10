import React from 'react';
import { ButtonProps } from '@fluentui/react-components';
import { useSearchParams } from 'next/navigation';
import { useSuspenseQuery } from '@tanstack/react-query';
import { subscriptionsQueryOptions } from '@/services/subscription/subscription.rquery';
import { useAppStore } from '@/app/providers/app-store-provider';
import { FeedNavModal } from '../feed-side-nav-panel';
import { SwipeoutWideButton } from './swipeout-wide-button';

export const FeedTitleButton: React.FC<ButtonProps> = React.memo(({ children, ...props }) => {
  const searchParams = useSearchParams();
  const streamId = searchParams.get("streamId");
  const { data } = useSuspenseQuery(subscriptionsQueryOptions);
  const subscription = data?.entities?.subscription?.[streamId!] ?? { title: '全部文章' };
  const toggleFeedSideNav = useAppStore(store => store.toggleFeedSideNav);
  const articleListPageChange = useAppStore(store => store.articleListPageChange);

  return (
    <>
      <FeedNavModal />
      <SwipeoutWideButton
        leftBtnsProps={[{ text: '上翻页', onClick: () => articleListPageChange(-1) }]}
        rightBtnsProps={[{ text: '下翻页', onClick: () => articleListPageChange(1) }]}
        onClick={toggleFeedSideNav}
        {...props}
      >
        {subscription?.title}
      </SwipeoutWideButton>
    </>
  )
})

FeedTitleButton.displayName = "FeedTitleButton";

