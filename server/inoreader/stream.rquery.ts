import { infiniteQueryOptions } from "@tanstack/react-query";
import service from "@server/index";
import { SystemStreamIDs } from "./stream.types";

export const makeStreamContentQueryOptions = (queryKey: unknown[]) =>
  infiniteQueryOptions({
    queryKey,
    queryFn: async ({ queryKey, pageParam }) => {
      const [, streamId, unreadOnly] = queryKey;
      const exclude = !!unreadOnly ? SystemStreamIDs.READ : "";
      const res = await service.inoreader.getStreamContents(String(streamId), {
        xt: exclude,
        c: pageParam,
      });
      return res.data;
    },
    initialPageParam: "",
    getNextPageParam: (lastPage) => lastPage.continuation,
  });