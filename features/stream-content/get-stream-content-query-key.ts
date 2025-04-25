import { QUERY_KEYS } from "@/constants";
import { SystemStreamIDs } from "@services/inoreader/stream.types";
import { getRootStreamId } from "./get-root-stream-id";

interface StreamContentQueryKeyParmas {
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