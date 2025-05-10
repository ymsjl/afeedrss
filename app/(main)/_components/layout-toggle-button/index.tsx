"use client";

import React from "react";
import {
  ButtonProps,
  ToggleButton,
} from "@fluentui/react-components";
import { useAppStore } from "@/app/providers/app-store-provider";
import { useLargeThenMobile } from '@/utils/use-large-then-mobile';
import {
  bundleIcon,
  LayoutColumnOneThirdLeft20Regular,
  LayoutColumnOneThirdLeft20Filled,
} from "@fluentui/react-icons";

const LayoutIcon = bundleIcon(LayoutColumnOneThirdLeft20Filled, LayoutColumnOneThirdLeft20Regular);

export const LayoutToggleButton: React.FC<ButtonProps> = (props) => {
  const homePageLayoutTypeSelected = useAppStore((state) => state.homePageLayoutType);
  const toggleHomePageLayoutType = useAppStore((state) => state.toggleHomePageLayoutType);
  const isLargeThenMobile = useLargeThenMobile();
  const homePageLayoutType = isLargeThenMobile ? homePageLayoutTypeSelected : "default";

  return (
    <ToggleButton
      icon={<LayoutIcon filled={homePageLayoutType === "split"} />}
      checked={homePageLayoutType === "split"}
      onClick={toggleHomePageLayoutType}
      title="分栏视图"
      {...props}
    />
  );
};

LayoutToggleButton.displayName = "LayoutToggleButton";
