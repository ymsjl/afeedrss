import React, { PropsWithChildren } from 'react';
import { mergeClasses } from '@fluentui/react-components';
import { useClasses } from './actions-bar-layout.styles';

interface ActionsBarLayoutProps extends PropsWithChildren<{}> {
  className?: string;
  sticky?: boolean;
}

export const ActionsBarLayout: React.FC<ActionsBarLayoutProps> = React.memo(({ children, className, sticky }) => {
  const classes = useClasses();
  return (
    <div className={mergeClasses(
      classes.root,
      sticky && classes.sticky,
      className
    )}>
      {children}
    </div>
  );
});

ActionsBarLayout.displayName = 'ActionsBarLayout';

