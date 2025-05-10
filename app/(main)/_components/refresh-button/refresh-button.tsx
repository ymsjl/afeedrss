import React, { ComponentProps } from 'react';
import { Button } from '@fluentui/react-components';
import { bundleIcon, ArrowSync20Filled, ArrowSync20Regular } from '@fluentui/react-icons';
import { useQueryClient } from '@tanstack/react-query';
import { useStreamContentQueryKey } from '@/features/stream-content/stream-content-query-key-context';

const RefreshIcon = bundleIcon(ArrowSync20Filled, ArrowSync20Regular);

export const RefreshButton: React.FC<ComponentProps<typeof Button>> = React.memo((props) => {
  const queryClient = useQueryClient();
  const streamContentQueryKey = useStreamContentQueryKey();

  const onRefetch = () => {
    queryClient.refetchQueries({ queryKey: streamContentQueryKey });
  };

  return (
    <Button
      icon={<RefreshIcon />}
      onClick={onRefetch}
      {...props}
    />
  );
});

RefreshButton.displayName = 'RefreshButton';