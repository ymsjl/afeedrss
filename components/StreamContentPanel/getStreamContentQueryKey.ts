import { QUERY_KEYS } from "@/constants";
import { SystemStreamIDs } from "@/server/inoreader/stream.types";

export function getRootStreamId(userId: string) {
  return userId ? `user/${userId}/state/com.google/root` : '';
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
}: StreamContentQueryKeyParmas) {
  return [
    QUERY_KEYS.STREAM_CONTENT,
    streamId || getRootStreamId(userId),
    unreadOnly ? SystemStreamIDs.READ : '',
  ];
}