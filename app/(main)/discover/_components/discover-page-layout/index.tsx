'use client';

import React, { PropsWithChildren } from 'react';
import { useSharedPageLayoutClasses } from '@/styles/shared-page-layout.styles';
import { mergeClasses } from '@fluentui/react-components'
;
const DiscoverPageLayout: React.FC<PropsWithChildren<{}>> = ({ children }) => {
  const sharedPageLayoutClasses = useSharedPageLayoutClasses();

  return (
    <div className={mergeClasses(sharedPageLayoutClasses.mainLayout, sharedPageLayoutClasses.mainSurface)}>
      <div className={mergeClasses(sharedPageLayoutClasses.content, sharedPageLayoutClasses.fullHeightColumnLayout)}>{children}</div>
    </div>
  );
};

export default DiscoverPageLayout;
