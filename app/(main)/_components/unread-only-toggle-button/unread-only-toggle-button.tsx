"use client";

import React from "react";
import { ButtonProps, ToggleButton } from "@fluentui/react-components";
import {
  bundleIcon,
  EyeLines20Filled,
  EyeLines20Regular,
} from "@fluentui/react-icons";
import { useSearchParams } from "next/navigation";
import { useSearchParamNavigation } from "@/utils/use-search-param-navigation";

export const UnreadOnlyIcon = bundleIcon(EyeLines20Filled, EyeLines20Regular);

export const UnreadOnlyToggleButton: React.FC<ButtonProps> = (props) => {
  const searchParams = useSearchParams();
  const unreadOnly = searchParams.get("unreadOnly") === "true";
  const navigateWithSearch = useSearchParamNavigation();
  const onToggleUnreadOnly = () =>
    navigateWithSearch("/", { unreadOnly: unreadOnly ? null : "true" });

  return (
    <ToggleButton
      icon={<UnreadOnlyIcon filled={unreadOnly} />}
      checked={unreadOnly}
      onClick={onToggleUnreadOnly}
      title="仅看未读"
      {...props}
    />
  );
};

UnreadOnlyToggleButton.displayName = "UnreadOnlyToggleButton";
