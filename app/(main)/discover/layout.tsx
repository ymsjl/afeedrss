import React, { PropsWithChildren } from 'react';
import { DiscoverPageLayout } from './_components/discover-page-layout';
import { ReactQueryStreamedHydration } from '@tanstack/react-query-next-experimental';

const DiscoverLayout: React.FC<PropsWithChildren<{}>> = ({ children }) => {
  return (
    <DiscoverPageLayout>
      <ReactQueryStreamedHydration>
        {children}
      </ReactQueryStreamedHydration>
    </DiscoverPageLayout>
  );
};

export default DiscoverLayout;
