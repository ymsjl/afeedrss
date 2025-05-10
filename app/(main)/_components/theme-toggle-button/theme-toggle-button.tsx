"use client";

import React from "react";
import {
  Button,
  ButtonProps,
} from "@fluentui/react-components";
import { useAppStore } from "@/app/providers/app-store-provider";
import {
  bundleIcon,
  WeatherSunny20Filled,
  WeatherSunny20Regular,
  WeatherMoon20Filled,
  WeatherMoon20Regular,
} from "@fluentui/react-icons";

export const SunIcon = bundleIcon(WeatherSunny20Filled, WeatherSunny20Regular);

export const MoonIcon = bundleIcon(WeatherMoon20Filled, WeatherMoon20Regular);

export const ThemeToggleButton: React.FC<ButtonProps> = (props) => {
  const theme = useAppStore((state) => state.theme);
  const toggleTheme = useAppStore((state) => state.toggleTheme);

  return (
    <Button
      icon={theme === "light" ? <SunIcon /> : <MoonIcon />}
      onClick={toggleTheme}
      title="夜间模式"
      {...props}
    />
  );
};

ThemeToggleButton.displayName = "ThemeToggleButton";
