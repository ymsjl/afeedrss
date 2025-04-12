import React, { useContext } from "react";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import { extractFirst } from "../../utils";
import { QUERY_KEYS } from "../../constants";

export function getRootStreamId(userId: string) {
  return `user/${userId}/state/com.google/root`;
}

export interface StreamContentQueryKeyParmas {
  unreadOnly: boolean;
  userId: string;
  streamId?: string;
}

export function getStreamContentQueryKey({
  unreadOnly,
  userId,
  streamId,
}: StreamContentQueryKeyParmas): any[] {
  return [
    QUERY_KEYS.STREAM_CONTENT,
    streamId || getRootStreamId(userId),
    unreadOnly,
  ];
}

// Create the context
export const StreamContentQueryKeyContext = React.createContext<string[]>([]);

// Custom hook to use the context
export function useStreamContentQueryKey() {
  const queryKey = useContext(StreamContentQueryKeyContext);
  if (!queryKey) {
    throw new Error(
      "useStreamContentQueryKey must be used within StreamContentQueryKeyProvider"
    );
  }
  return queryKey;
}

// Provider component
export function StreamContentQueryKeyProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { data: session } = useSession();
  const userId = session?.user?.id || "";
  const streamId = getRootStreamId(userId);
  const unreadOnly = !!extractFirst(router.query.unreadOnly);

  const streamContentQueryKey = getStreamContentQueryKey({
    unreadOnly,
    userId,
    streamId,
  });

  return (
    <StreamContentQueryKeyContext.Provider value={streamContentQueryKey}>
      {children}
    </StreamContentQueryKeyContext.Provider>
  );
}