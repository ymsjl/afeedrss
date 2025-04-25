'use client';

import React, { PropsWithChildren } from 'react';
import { usePageLayoutClasses } from '@/styles/usePageLayouClasses'; // 使用 usePageLayoutClasses 样式

const DiscoverPageLayout: React.FC<PropsWithChildren<{}>> = ({ children }) => {
  const pageLayoutClasses = usePageLayoutClasses();

  return (
    <div className={pageLayoutClasses.main}>
      <div className={pageLayoutClasses.content}>{children}</div>
    </div>
  );
};

export default DiscoverPageLayout;
