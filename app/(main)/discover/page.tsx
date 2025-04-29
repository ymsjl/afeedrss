'use client'

import React, { Suspense, useState } from 'react';
import { SearchBox, Card, CardHeader, CardFooter, SearchBoxChangeEvent, InputOnChangeData, Button, Skeleton, SkeletonItem, mergeClasses } from '@fluentui/react-components';
import { useStyles } from './discover.style'; // 从样式文件中导入 useStyles
import { Add12Filled } from '@fluentui/react-icons';
import { useSuspenseQuery } from '@tanstack/react-query';
import { subscriptionsQueryOptions } from '@/services/subscription/subscription.rquery';
import { denormalize } from 'normalizr';
import { Subscription } from '@/services/subscription';
import { subscriptionSchema } from "@/services/subscription/subscription.entity";
import { useCommonClasses } from '@/theme/commonStyles';

const FeedGallery = React.memo(() => {
  const styles = useStyles();
  const subscriptionsQuery = useSuspenseQuery(subscriptionsQueryOptions);
  const subscriptionsData = subscriptionsQuery.data;
  const subscriptions: Subscription[] = denormalize(subscriptionsData.result, [subscriptionSchema], subscriptionsData.entities) ?? [];

  const renderFeedCard = (feed: Subscription) => (
    <Card key={feed.id} className={styles.card}>
      <CardHeader
        image={<img src={feed.iconUrl} alt={feed.title} className={styles.icon} />}
        header={feed.title}
        action={
          <Button
            icon={<Add12Filled />}
            size='small'
            aria-label="add feed"
          />
        }
      />
      <CardFooter>{feed.description ?? ''}</CardFooter>
    </Card>
  );

  return (
    <div className={styles.gallery}>
      {subscriptions.map(renderFeedCard)}
    </div>
  );
})

const FeedCardSkeleton = () => {
  const styles = useStyles();
  const commonClasses = useCommonClasses();
  return (
    <Skeleton >
      <Card className={styles.card}>
        <CardHeader
          image={<SkeletonItem shape='square' size={32} className={styles.icon} />}
          header={<SkeletonItem />}
          action={null}
        />
        <CardFooter className={styles.skeletonCardFooter}>
          <SkeletonItem className={commonClasses.block} />
          <SkeletonItem className={commonClasses.block} />
          <SkeletonItem className={commonClasses.block} />
        </CardFooter>
      </Card>
    </Skeleton>
  );
}

const FeedGallerySkeleton = () => {
  const styles = useStyles();
  return (
    <div className={styles.gallery}>
      {Array.from({ length: 12 }, (_, index) => (
        <FeedCardSkeleton key={index} />
      ))}
    </div>
  );
}

const DiscoverPage = () => {
  const styles = useStyles();
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (event: SearchBoxChangeEvent, data: InputOnChangeData) => {
  };

  return (
    <div className={styles.container}>
      <SearchBox
        className={styles.searchBox}
        placeholder="搜索订阅源..."
        onChange={handleSearch}
      />
      <Suspense fallback={<FeedGallerySkeleton />}>
        <FeedGallery />
      </Suspense>
    </div>
  );
};

export default DiscoverPage;
