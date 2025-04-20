import React, { useState } from "react";

export interface GlobalNavigation {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}
export const defaultGlobalNavigation = {
  isOpen: true,
  setIsOpen: () => {},
};


export const GlobalNavigationCtx = React.createContext<GlobalNavigation>(
  defaultGlobalNavigation
);

export function GlobalNavigationCtxProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isNavigationPanelOpen, setIsNavigationPanelOpen] = useState(true);

  return (
    <GlobalNavigationCtx.Provider
      value={{
        isOpen: isNavigationPanelOpen,
        setIsOpen: setIsNavigationPanelOpen,
      }}
    >
      {children}
    </GlobalNavigationCtx.Provider>
  );
}

