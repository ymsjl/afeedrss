'use client';
import React from 'react';
import { Spinner, makeStyles, tokens, Text } from '@fluentui/react-components';
import { usePageLayoutClasses } from '@/styles/usePageLayouClasses';

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
  const pageLayoutClasses = usePageLayoutClasses();
  return (
    <div className={pageLayoutClasses.main}>
      <div className={pageLayoutClasses.content}>
        <div className={styles.content}>
          <Spinner size="large" />
          <Text size={400} className={styles.text}>Loading...</Text>
        </div>
      </div>
    </div>
  );
}