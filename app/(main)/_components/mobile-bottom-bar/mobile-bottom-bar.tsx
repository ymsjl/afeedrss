import React, { Suspense } from 'react';
import { Button } from '@fluentui/react-components';
import { useAppStore } from '@/app/providers/app-store-provider';
import { useFlexClasses } from '@/theme/commonStyles';
import { CloseArticleReadPanelButton } from '../close-article-read-panel-button';
import { ArticleTitleButton } from './article-title-button';
import { StarButton } from '../star-button';
import { RefreshButton } from '../refresh-button';
import { FeedTitleButton } from './feed-title-button';
import { SettingsButton } from './settings-button';
import { useClasses } from './mobile-bottom-bar.style';

export const MobileBottomBar = React.memo(({ }) => {
  const classes = useClasses();
  const flexClasses = useFlexClasses();
  const isArticlePanelOpen = useAppStore(store => store.isArticlePanelOpen);

  const fallbackButton = <Button size='large' className={flexClasses.flexGrow} >...</Button>

  const contentRender = () => {
    if (isArticlePanelOpen) {
      return (
        <>
          <CloseArticleReadPanelButton size='large' />
          <Suspense fallback={fallbackButton}>
            <ArticleTitleButton size='large' />
          </Suspense>
          <StarButton size='large' />
        </>
      )
    } else {
      return (
        <>
          <SettingsButton size="large" />
          <Suspense fallback={fallbackButton}>
            <FeedTitleButton size='large' />
          </Suspense>
          <RefreshButton size="large" />
        </>
      );
    }
  }

  return (
    <div className={classes.root}>
      {contentRender()}
    </div>
  )
})

MobileBottomBar.displayName = "MobileBottomBar";