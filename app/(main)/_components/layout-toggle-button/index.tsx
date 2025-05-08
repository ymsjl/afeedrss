"use client";

import React from "react";
import {
  ToggleButton,
} from "@fluentui/react-components";
import { useAppStore } from "@/app/providers/app-store-provider";
import { useLargeThenMobile } from '@/utils/use-large-then-mobile';
import {
  bundleIcon,
  LayoutColumnOneThirdLeft20Regular,
  LayoutColumnOneThirdLeft20Filled,
} from "@fluentui/react-icons";

interface LayoutToggleButtonProps {
  className?: string;
}

const LayoutIcon = bundleIcon(
  LayoutColumnOneThirdLeft20Filled,
  LayoutColumnOneThirdLeft20Regular
);

export const LayoutToggleButton = ({ className }: LayoutToggleButtonProps) => {
  const layoutTypeSelected = useAppStore((state) => state.layoutType);
  const toggleLayoutType = useAppStore((state) => state.toggleLayoutType);
  const isLargeThenMobile = useLargeThenMobile();
  const layoutType = isLargeThenMobile ? layoutTypeSelected : "default";

  return (
    <ToggleButton
      className={className}
      icon={<LayoutIcon />}
      checked={layoutType === "split"}
      onClick={toggleLayoutType}
      title="分栏视图"
    />
  );
};

LayoutToggleButton.displayName = "LayoutToggleButton";
