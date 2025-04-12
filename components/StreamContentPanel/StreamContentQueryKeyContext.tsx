import React, { useContext } from "react";
import { useSession } from "next-auth/react";
import { extractFirst } from "../../utils";
import { QUERY_KEYS } from "../../constants";
import { useSearchParams } from "next/navigation";

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
  const { data: session } = useSession();
  const userId = session?.user?.id || "";
  const searchParams = useSearchParams();
  const streamId =
    extractFirst(searchParams.get("streamId")) || getRootStreamId(userId);
  const unreadOnly = !!extractFirst(searchParams.get("unreadOnly"));

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
