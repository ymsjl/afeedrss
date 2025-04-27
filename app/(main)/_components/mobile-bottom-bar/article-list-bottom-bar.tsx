import React from 'react';
import { Button } from '@fluentui/react-components';
import { bundleIcon, ArrowSync20Filled, ArrowSync20Regular, Settings20Filled, Settings20Regular } from '@fluentui/react-icons';
import { useSearchParams } from 'next/navigation';
import { useQueryClient, useSuspenseQuery } from '@tanstack/react-query';
import { subscriptionsQueryOptions } from '@services/inoreader/subscription.rquery';
import { useAppStore } from '@/app/providers/app-store-provider';
import { useClasses } from './mobile-bottom-bar.style';
import Link from 'next/link';
import { useStreamContentQueryKey } from '@/features/stream-content/stream-content-query-key-context';

const RefreshIcon = bundleIcon(ArrowSync20Filled, ArrowSync20Regular);
const SettingsIcon = bundleIcon(Settings20Filled, Settings20Regular);

export const ArticleListBottomBar = React.memo(() => {
  const classes = useClasses();
  const searchParams = useSearchParams();
  const unreadOnly = searchParams.get("unreadOnly") === 'true';
  const streamId = searchParams.get("streamId");
  const { data } = useSuspenseQuery(subscriptionsQueryOptions);
  const subscription = data?.entities?.subscription?.[streamId!] ?? { title: '全部文章' };
  const queryClient = useQueryClient()
  const toggleFeedSideNav = useAppStore(store => store.toggleFeedSideNav);
  const streamContentQueryKey = useStreamContentQueryKey();
  const onRefetch = () => queryClient.refetchQueries({queryKey: streamContentQueryKey});

  return (
    <>
      <Link href="/settings" passHref>
        <Button icon={<SettingsIcon />} size="large" />
      </Link>
      <div className={classes.titleContainer}>
        <Button className={classes.title} onClick={toggleFeedSideNav} size="large">{subscription?.title}</Button>
      </div>
      <Button icon={<RefreshIcon filled={unreadOnly} />} onClick={onRefetch} size='large' />
    </>
  );
});

ArticleListBottomBar.displayName = 'ArticleListBottomBar';
