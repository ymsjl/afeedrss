import React from 'react';
import { Button } from '@fluentui/react-components';
import { bundleIcon, Settings20Filled, Settings20Regular } from '@fluentui/react-icons';
import { useSearchParams } from 'next/navigation';
import {  useSuspenseQuery } from '@tanstack/react-query';
import { subscriptionsQueryOptions } from '@services/inoreader/subscription.rquery';
import { useAppStore } from '@/app/providers/app-store-provider';
import { useClasses } from './mobile-bottom-bar.style';
import Link from 'next/link';
import { RefreshButton } from '../refresh-button';
import Swipeout from '@/components/swipe-out';

const SettingsIcon = bundleIcon(Settings20Filled, Settings20Regular);

export const ArticleListBottomBar = React.memo(() => {
  const classes = useClasses();
  const searchParams = useSearchParams();
  const streamId = searchParams.get("streamId");
  const { data } = useSuspenseQuery(subscriptionsQueryOptions);
  const subscription = data?.entities?.subscription?.[streamId!] ?? { title: '全部文章' };
  const toggleFeedSideNav = useAppStore(store => store.toggleFeedSideNav);
  const articleListPageChange = useAppStore(store => store.articleListPageChange);

  return (
    <>
      <Link href="/settings" passHref>
        <Button icon={<SettingsIcon />} size="large" />
      </Link>
      <Swipeout
        className={classes.titleContainer}
        overswipeRatio={0.32}
        leftBtnsProps={[
          {
            text: '上翻页',
            onClick: () => articleListPageChange(-1)
          }
        ]}
        rightBtnsProps={[
          {
            text: '下翻页',
            onClick: () => articleListPageChange(1)
          }
        ]}
      >
        <Button className={classes.title} onClick={toggleFeedSideNav} size="large">{subscription?.title}</Button>
      </Swipeout>
      <RefreshButton size="large" />
    </>
  );
});

ArticleListBottomBar.displayName = 'ArticleListBottomBar';
