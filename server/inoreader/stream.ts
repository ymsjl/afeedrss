import qs from "query-string";
import { fetch } from "../index";
import { StreamContentsResponse, IdValuePair } from "./types";
import { MarkArticleParmas, SystemStreamIDs } from "./types";

/**
 * 获取 Feed 流的文章列表
 * @returns
 */
export function getStreamContents(
  streamId: string,
  { number, order, startTime, exclude, include, continuation }: any | undefined
) {
  return fetch.get<StreamContentsResponse>(
    `/reader/api/0/stream/contents/${encodeURIComponent(streamId)}`,
    {
      params: {
        n: 20, // Number of items to return (default 20, max 1000).
        r: "", // Order. By default, it is newest first. You can pass o here to get oldest first.
        ot: "", // Start time (unix timestamp) from which to start to get items. If r=o and the time is older than one month ago, one month ago will be used instead.
        xt: exclude, // Exclude Target - You can query all items from a feed that are not flagged as read by setting this to user/-/state/com.google/read.
        it: "", // include Target - You can query for a certain label with this. Accepted values: user/-/state/com.google/starred, user/-/state/com.google/like.
        c: continuation, // Continuation - a string used for continuation process. Each response returns not all, but only a certain number of items. You'll find in the JSON response a string called continuation. Just add that string as argument for this parameter, and you'll retrieve next items. If the continuation string is missing, then you are at the end of the stream.
        output: "", // if you prefer JSON object pass json here. Note that reader/api/0/stream/contents always returns json object, while reader/atom returns XML by default.
        includeAllDirectStreamIds: "", // set this to false if you want to receive only manually added tags in the categories list. Otherwise automatically added tags from the folders will be populated there too.
        annotations: "", // set this to 1 or true if you want to get an array of your annotations for each article.
      },
    }
  );
}

export interface StreamPreferenceListResponse {
  streamprefs: {
    [key: string]: IdValuePair[];
  };
}

/**
 * 获取文章流偏好列表
 * @returns
 */
export function getStreamPreferenceList() {
  return fetch.get<StreamPreferenceListResponse>(
    `/reader/api/0/preference/stream/list`
  );
}

/**
 * 添加/移除某个源下的所有文章的已读标记
 * @params
 * @returns 
 */
export function markAllAsRead(streamId: string) {
  return fetch.post(`/reader/api/0/mark-all-as-read`, null, {
    params: {
      ts: Date.now(),
      s: streamId,
    },
  });
}

/**
 * 添加/移除文章的收藏标记
 * @params
 * @returns 
 */
export function markArticleAsStar(id: string, isStar?: boolean) {
  const params: MarkArticleParmas = { i: id };
  params[isStar ? "r" : "a"] = SystemStreamIDs.STARRED;
  return fetch.post(`/reader/api/0/edit-tag`, null, {
    params: params,
  });
}


/**
 * 添加/移除文章的已读标记
 * @params
 * @returns 
 */
export function markArticleAsRead(id: string | string[], asUnread?: boolean){
  const params: MarkArticleParmas = { i: id };
  params[asUnread ? "r" : "a"] = SystemStreamIDs.READ;
  return fetch.post(`/reader/api/0/edit-tag`, null, {
    params: params,
    paramsSerializer: (params) => {
      const result = qs.stringify(params);
      return result;
    },
  });
}