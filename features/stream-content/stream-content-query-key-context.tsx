'use client'
import React, { useContext } from "react";
import { extractFirst } from "@utils/index";
import { useSearchParams } from "next/navigation";
import { getStreamContentQueryKey } from "@features/stream-content/get-stream-content-query-key";
import { useAppStore } from "@/app/providers/app-store-provider";

export const StreamContentQueryKeyContext = React.createContext<string[]>([]);

export function StreamContentQueryKeyProvider({
  initValue = [],
  children,
}: {
  initValue?: string[];
  children: React.ReactNode;
}) {
  const userId = useAppStore(store => store.session?.user?.id || "");
  const searchParams = useSearchParams();
  const streamId = extractFirst(searchParams.get("streamId"));
  const unreadOnly = !!extractFirst(searchParams.get("unreadOnly"));

  const streamContentQueryKey =  (typeof window === "undefined" || !userId)
    ? initValue
    : getStreamContentQueryKey({
        unreadOnly,
        userId,
        streamId,
      });

  return (
    <StreamContentQueryKeyContext.Provider
      value={streamContentQueryKey}
    >
      {children}
    </StreamContentQueryKeyContext.Provider>
  );
}

export function useStreamContentQueryKey() {
  const queryKey = useContext(StreamContentQueryKeyContext);
  if (!queryKey) {
    throw new Error(
      "useStreamContentQueryKey must be used within StreamContentQueryKeyProvider"
    );
  }
  return queryKey;
}
