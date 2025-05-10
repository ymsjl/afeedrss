import React from 'react';
import { ButtonProps } from '@fluentui/react-components';
import { useAppStore } from '@/app/providers/app-store-provider';
import { useArticleNavigation } from './use-article-navigation';
import { SwipeoutWideButton } from './swipeout-wide-button';

export const ArticleTitleButton: React.FC<ButtonProps> = React.memo((props) => {
  const currentArticle = useAppStore(store => store.currentArticle);
  const { onPrev, onNext } = useArticleNavigation();

  return (
    <SwipeoutWideButton
      leftBtnsProps={[{ text: '上一篇', onClick: onPrev }]}
      rightBtnsProps={[{ text: '下一篇', onClick: onNext }]}
      {...props}
    >
      {currentArticle?.title}
    </SwipeoutWideButton>
  );
});

ArticleTitleButton.displayName = "ArticleTitleButton";
