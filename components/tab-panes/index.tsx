"use client";
import { mergeClasses, makeStyles } from "@fluentui/react-components";
import React, { PropsWithChildren, useMemo } from "react";

interface TabContextType {
  activedValue: string;
}

interface ClassName {
  className?: string
}

const TabContext = React.createContext<TabContextType>({ activedValue: '' });

export function TabContextProvider({ children, activedValue }: PropsWithChildren<{ activedValue: string }>) {
  return (
    <TabContext.Provider value={{ activedValue }}>
      {children}
    </TabContext.Provider>
  );
}

export function useTab() {
  return React.useContext(TabContext);
}

export function useIsTabActived(value: string) {
  const { activedValue } = useTab();
  return useMemo(() => value === activedValue, [value, activedValue]);
}

export function TabPanels({ children, className }: PropsWithChildren<ClassName>) {
  const tabClasses = useTabClasses();
  return (
    <div className={mergeClasses(tabClasses.tabPanes, className)}>
      {children}
    </div>
  );
}

export function TabPanel({ children, className, value }: PropsWithChildren<ClassName & { value: string; }>) {
  const tabClasses = useTabClasses();
  const isActived = useIsTabActived(value);
  if (!isActived) return null;

  return (
    <div className={mergeClasses(tabClasses.tabPane, isActived ? tabClasses.tabPaneActived : tabClasses.tabPaneHidden, className)}>
      {children}
    </div>
  );
}

const useTabClasses = makeStyles({
  tabPanes: {},
  tabPane: {},
  tabPaneActived: {
    display: 'block',
  },
  tabPaneHidden: {
    display: 'none',
  }
});
