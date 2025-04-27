import React from 'react';
import { Button, ToggleButton } from '@fluentui/react-components';
import { bundleIcon, Filter20Filled, Filter20Regular, Settings20Filled, Settings20Regular } from '@fluentui/react-icons';
import { useSearchParams } from 'next/navigation';
import { useSuspenseQuery } from '@tanstack/react-query';
import { subscriptionsQueryOptions } from '@services/inoreader/subscription.rquery';
import { useAppStore } from '@/app/providers/app-store-provider';
import { useSearchParamNavigation } from '@utils/use-search-param-navigation';
import { useClasses } from './mobile-bottom-bar.style';
import Link from 'next/link';

const FilterIcon = bundleIcon(Filter20Filled, Filter20Regular);
const SettingsIcon = bundleIcon(Settings20Filled, Settings20Regular);

export const ArticleListBottomBar = React.memo(() => {
  const classes = useClasses();
  const searchParams = useSearchParams();
  const unreadOnly = searchParams.get("unreadOnly") === 'true';
  const streamId = searchParams.get("streamId");
  const { data } = useSuspenseQuery(subscriptionsQueryOptions);
  const subscription = data?.entities?.subscription?.[streamId!] ?? { title: '全部文章' };

  const navigateWithSearch = useSearchParamNavigation();
  const toggleFeedSideNav = useAppStore(store => store.toggleFeedSideNav);
  const onToggleUnreadOnly = () => navigateWithSearch('/', { unreadOnly: unreadOnly ? null : 'true' });

  return (
    <>
      <Link href="/settings" passHref>
        <Button icon={<SettingsIcon />} size="large" />
      </Link>
      <div className={classes.titleContainer}>
        <Button className={classes.title} onClick={toggleFeedSideNav} size="large">{subscription?.title}</Button>
      </div>
      <ToggleButton icon={<FilterIcon filled={unreadOnly} />} onClick={onToggleUnreadOnly} size='large' />
    </>
  );
});

ArticleListBottomBar.displayName = 'ArticleListBottomBar';
