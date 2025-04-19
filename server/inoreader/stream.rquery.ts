import { infiniteQueryOptions, QueryFunction } from "@tanstack/react-query";
import service from "@server/index";
import { StreamContentsResponse } from "./stream.types";

const queryStreamContentsFn: QueryFunction<StreamContentsResponse, string[], string> = async ({ queryKey, pageParam }) => {
  const [, streamId, exclude] = queryKey;
  if (!streamId) {
    return {
      items: [],
      continuation: '',
      description: '',
      direction: 'ltr',
      title: '',
      updated: 0,
      id: '',
    } as StreamContentsResponse
  }
  const res = await service.inoreader.getStreamContents(streamId, {
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