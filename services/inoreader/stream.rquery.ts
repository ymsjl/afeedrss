import { infiniteQueryOptions, QueryFunction } from "@tanstack/react-query";
import services from "@services/index";
import { StreamContentsResponse } from "./stream.types";

const queryStreamContentsFn: QueryFunction<StreamContentsResponse, string[], string> = async ({ queryKey, pageParam }) => {
  const [, streamId, exclude] = queryKey;
  const res = await services.inoreader.getStreamContents(streamId, {
    exclude,
    continuation: pageParam,
  });
  return res.data;
}

export const makeStreamContentQueryOptions = (queryKey: string[]) =>
  infiniteQueryOptions({
    queryKey,
    queryFn: queryStreamContentsFn,
    initialPageParam: "",
    getNextPageParam: (lastPage) => lastPage.continuation,
  });