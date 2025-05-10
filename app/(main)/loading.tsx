'use client';
import React from 'react';
import { Spinner, makeStyles, tokens, Text, mergeClasses } from '@fluentui/react-components';
import { useSharedPageLayoutClasses } from '@/styles/shared-page-layout.styles';

const useStyles = makeStyles({
  content: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    width: '100%',
  },
  text: {
    marginTop: tokens.spacingVerticalL,
  }
});

export default function Loading() {
  const styles = useStyles();
  const sharedPageLayoutClasses = useSharedPageLayoutClasses();
  return (
    <div className={mergeClasses(sharedPageLayoutClasses.mainLayout, sharedPageLayoutClasses.mainSurface)}>
      <div className={mergeClasses(sharedPageLayoutClasses.content, sharedPageLayoutClasses.fullHeightColumnLayout)}>
        <div className={styles.content}>
          <Spinner size="large" />
          <Text size={400} className={styles.text}>Loading...</Text>
        </div>
      </div>
    </div>
  );
}