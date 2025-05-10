import React, { Suspense } from 'react';
import { useClasses } from './mobile-bottom-bar.style';
import { useAppStore } from '@/app/providers/app-store-provider';
import { ReaderBottomBar } from './reader-bottom-bar';
import { ArticleListBottomBar } from './article-list-bottom-bar';

export const MobileBottomBar = React.memo(({}) => {
  const classes = useClasses();
  const isArticlePanelOpen = useAppStore(store => store.isArticlePanelOpen);

  const contentRender = () => {
    if (!isArticlePanelOpen) {
      return <ArticleListBottomBar />;
    } else {
      return <ReaderBottomBar />
    }
  }

  return (
    <div className={classes.root}>
      <Suspense fallback={<div />}>
        {contentRender()}
      </Suspense>
    </div>
  )
})

MobileBottomBar.displayName = "MobileBottomBar";