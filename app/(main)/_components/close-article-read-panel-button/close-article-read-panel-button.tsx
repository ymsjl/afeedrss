import React from 'react';
import { ButtonProps, Button } from '@fluentui/react-components';
import { ChevronLeft20Regular } from '@fluentui/react-icons';
import { useArticleReadPanelControl } from '@/app/(main)/_components/article-read-panel';

export const CloseArticleReadPanelButton: React.FC<ButtonProps> = (props) => {
  const { closeArticlePanel } = useArticleReadPanelControl();
  return (
    <Button
      icon={<ChevronLeft20Regular />}
      onClick={closeArticlePanel}
      {...props} />
  );
};
