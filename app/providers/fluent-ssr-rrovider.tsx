"use client";

import * as React from "react";
import {
  FluentProvider,
  webLightTheme,
  webDarkTheme,
  SSRProvider,
  RendererProvider,
  createDOMRenderer,
  renderToStyleElements,
} from "@fluentui/react-components";
import { useServerInsertedHTML } from "next/navigation";
import { useAppStore } from "./app-store-provider";

export function FluentSSRProvider({ children }: { children: React.ReactNode }) {
  const [renderer] = React.useState(() => createDOMRenderer());
  const didRenderRef = React.useRef(false);
  const isDarkMode = useAppStore((state) => state.theme) === "dark";

  useServerInsertedHTML(() => {
    if (didRenderRef.current) {
      return;
    }
    didRenderRef.current = true;
    return <>{renderToStyleElements(renderer)}</>;
  });

  return (
    <RendererProvider renderer={renderer}>
      <SSRProvider>
        <FluentProvider theme={isDarkMode ? webDarkTheme : webLightTheme}>{children}</FluentProvider>
      </SSRProvider>
    </RendererProvider>
  );
}
