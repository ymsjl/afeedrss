"use client";

import React from "react";
import {
  Button,
} from "@fluentui/react-components";
import { useAppStore } from "@/app/providers/app-store-provider";
import {
  bundleIcon,
  WeatherSunny20Filled,
  WeatherSunny20Regular,
  WeatherMoon20Filled,
  WeatherMoon20Regular,
} from "@fluentui/react-icons";

interface ThemeToggleButtonProps {
  className?: string;
}

export const SunIcon = bundleIcon(WeatherSunny20Filled, WeatherSunny20Regular);

export const MoonIcon = bundleIcon(WeatherMoon20Filled, WeatherMoon20Regular);

export const ThemeToggleButton = ({ className }: ThemeToggleButtonProps) => {
  const theme = useAppStore((state) => state.theme);
  const toggleTheme = useAppStore((state) => state.toggleTheme);

  return (
    <Button
      className={className}
      icon={theme === "light" ? <SunIcon /> : <MoonIcon />}
      onClick={toggleTheme}
      title="夜间模式"
    />
  );
};

ThemeToggleButton.displayName = "ThemeToggleButton";
