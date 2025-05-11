"use client";

import React from "react";
import {
  ButtonProps,
  ToggleButton,
} from "@fluentui/react-components";
import { useAppStore } from "@/app/providers/app-store-provider";
import {
  bundleIcon,
  LayoutColumnOneThirdLeft20Regular,
  LayoutColumnOneThirdLeft20Filled,
} from "@fluentui/react-icons";
import { useHomePageLayoutType } from "../page-client/use-home-page-layout-type";

const LayoutIcon = bundleIcon(LayoutColumnOneThirdLeft20Filled, LayoutColumnOneThirdLeft20Regular);

export const LayoutToggleButton: React.FC<ButtonProps> = (props) => {
  const toggleHomePageLayoutType = useAppStore((state) => state.toggleHomePageLayoutType);
  const homePageLayoutType = useHomePageLayoutType();

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
