import { infiniteQueryOptions, QueryFunction, queryOptions } from "@tanstack/react-query";
import streamApi from "./stream.endpoints";
import { StreamContentsResponse } from "./stream.types";
import { QUERY_KEYS } from "@/services/constants";

const queryStreamContentsFn: QueryFunction<StreamContentsResponse, string[], string> = async ({ queryKey, pageParam }) => {
  const [, streamId, exclude] = queryKey;
  const res = await streamApi.getStreamContents(streamId, {
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


export const streamPreferencesQueryOptions = queryOptions({
  queryKey: [QUERY_KEYS.STREAM_PREFERENCES],
  queryFn: async () => {
    const res = await streamApi.getStreamPreferenceList();
    return res.data;
  }
});