import React, { ComponentProps, useMemo } from 'react';
import { ButtonProps, Button } from '@fluentui/react-components';
import { Swipeout } from '@/components/swipe-out';
import { useCommonClasses, useFlexClasses } from '@/theme/commonStyles';

export const SwipeoutWideButton: React.FC<ButtonProps & Pick<ComponentProps<typeof Swipeout>, 'leftBtnsProps' | 'rightBtnsProps'>> =
  React.memo((props) => {
    const { leftBtnsProps, rightBtnsProps, children, ...buttonProps } = props;
    const commonClasses = useCommonClasses();
    const flexClasses = useFlexClasses();

    const childrenDisplay = useMemo(() => {
      if (typeof children !== 'string') return children;
      let result = children || '';
      const maxLength = 14;
      if (result.length > maxLength) {
        const halfLength = Math.floor(maxLength / 2);
        result = `${result.slice(0, halfLength)}...${result.slice(-halfLength)}`;
      }
      return result;
    }, [children]);

    return (
      <Swipeout
        className={flexClasses.flexGrow}
        overswipeRatio={0.32}
        leftBtnsProps={leftBtnsProps}
        rightBtnsProps={rightBtnsProps}
      >
        <Button className={commonClasses.w100} {...buttonProps}>{childrenDisplay}</Button>
      </Swipeout>
    );
  });

SwipeoutWideButton.displayName = "SwipeoutWideButton";
