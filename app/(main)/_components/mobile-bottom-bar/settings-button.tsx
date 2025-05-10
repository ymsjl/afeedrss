import React from 'react';
import { Button, ButtonProps } from '@fluentui/react-components';
import { bundleIcon, Settings20Filled, Settings20Regular } from '@fluentui/react-icons';
import { ArticleListSettingsModal } from '../article-list-settings-modal';

const SettingsIcon = bundleIcon(Settings20Filled, Settings20Regular);

export const SettingsButton: React.FC<ButtonProps> = React.memo((props) => {
  const [isSettingsModalOpen, setIsSettingsModalOpen] = React.useState(false)
  return (
    <>
      <Button icon={<SettingsIcon />} onClick={() => setIsSettingsModalOpen(true)} {...props} />
      <ArticleListSettingsModal isOpen={isSettingsModalOpen} onClose={() => setIsSettingsModalOpen(false)} />
    </>
  )
})

SettingsButton.displayName = "SettingsButton";