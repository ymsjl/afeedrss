"use client";
import React from "react";
import { useCommonClasses } from "@/theme/commonStyles";
import { mergeClasses } from "@fluentui/react-components";
import { useClasses } from "./z-stack-layout.styles";

export interface ZStackLayoutProps {
  isOpen: boolean;
  className?: string;
  children: (params: {
    firstChildClassName: string;
    secondChildClassName: string;
  }) => React.ReactNode;
}

export const ZStackLayout = ({ children, className, isOpen }: ZStackLayoutProps) => {
  const classes = useClasses();
  const commonClasses = useCommonClasses();

  const stackLayerClassName = mergeClasses(
    commonClasses.absoluteFill,
    classes.stackLayer
  );

  const firstChildClassName = mergeClasses(
    stackLayerClassName,
    (isOpen && classes.firstChildOnLeft)
  );

  const secondChildClassName = mergeClasses(
    stackLayerClassName,
    !isOpen && classes.secondChildOnRight
  );

  return (
    <div className={mergeClasses(className, commonClasses.relative)}>
      {children({ firstChildClassName, secondChildClassName })}
    </div>
  );
};
