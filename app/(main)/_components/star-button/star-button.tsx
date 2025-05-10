import React from 'react';
import { useAppStore } from '@/app/providers/app-store-provider';
import { useStreamContentActions } from '@/features/stream-content/use-stream-content-actions';
import { useStreamContentsQuery } from '@/features/stream-content/use-stream-contents-query';
import { Button, ButtonProps } from '@fluentui/react-components';
import { bundleIcon, Star20Filled, Star20Regular } from '@fluentui/react-icons';
import { useClasses } from './star-button.styles';

export const StarIcon = bundleIcon(Star20Filled, Star20Regular);

export const StarButton = React.memo((props: ButtonProps) => {
  const classes = useClasses();
  const currentArticle = useAppStore(store => store.currentArticle);
  const curArticleIndex = useAppStore(store => store.currentArticleIndex);
  const { data: items } = useStreamContentsQuery();
  const { markItemAsStar } = useStreamContentActions();

  const isArticleStarred = items?.[curArticleIndex]?.isStarred || false;

  return (
    <Button
      icon={<StarIcon filled={isArticleStarred} className={isArticleStarred ? classes.highlight : ''} />}
      disabled={!currentArticle}
      onClick={() => currentArticle && markItemAsStar(currentArticle)}
      {...props}
    />
  );
});

StarButton.displayName = "StarButton";