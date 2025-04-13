import React, { useContext } from "react";
import { useSession } from "next-auth/react";
import { extractFirst } from "../../utils";
import { useSearchParams } from "next/navigation";
import { getStreamContentQueryKey } from "./getStreamContentQueryKey";

export const StreamContentQueryKeyContext = React.createContext<string[]>([]);

export function StreamContentQueryKeyProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session } = useSession();
  const userId = session?.user?.id || "";
  const searchParams = useSearchParams();
  const streamId = extractFirst(searchParams.get("streamId"));
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

export function useStreamContentQueryKey() {
  const queryKey = useContext(StreamContentQueryKeyContext);
  if (!queryKey) {
    throw new Error(
      "useStreamContentQueryKey must be used within StreamContentQueryKeyProvider"
    );
  }
  return queryKey;
}
