"use client";

import { Session } from "next-auth";
import React, { useEffect } from "react";
import { useAppStore } from "./AppStoreProvider";

interface ServerSessionProviderProps {
  children: React.ReactNode;
  session: Session | null;
}

export function ServerSessionProvider({
  children,
  session,
}: ServerSessionProviderProps) {
  const setSession = useAppStore(store => store.setSession)

  useEffect(() => {
    setSession(session)
  }, [session])

  return <>{children}</>;
}