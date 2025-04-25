import { fetch } from "../index";
import { StreamContentsParams, StreamPreferenceListResponse, StreamContentsResponse, StreamItemsIdsResponse, MarkArticleParmas, SystemStreamIDs, StreamItemsIdsParams } from "./stream.types";

/**
 * 获取 Feed 流的文章列表
 */
export function getStreamContents(
  streamId: string,
  { exclude, continuation }: any | undefined
) {
  return fetch.get<StreamContentsResponse, StreamContentsParams>(
    `/reader/api/0/stream/contents/${encodeURIComponent(streamId)}`,
    {
      params: {
        n: 20,
        r: "",
        xt: exclude,
        it: "",
        c: continuation,
      },
    }
  );
}

export function getStreamItemIds(
  streamId: string,
  { exclude, continuation }: any | undefined
) {
  return fetch.get<StreamItemsIdsResponse, StreamItemsIdsParams>(
    `/reader/api/0/stream/items/ids`,
    {
      params: {
        n: 20,
        r: "",
        xt: exclude,
        it: "",
        c: continuation,
        s: streamId,
      },
    }
  );
}

/**
 * 获取文章流偏好列表
 * @returns 流偏好字典，包含了所有的流 ID 和对应偏好属性
 */
export function getStreamPreferenceList() {
  return fetch.get<StreamPreferenceListResponse>('/reader/api/0/preference/stream/list');
}

/**
 * 添加/移除某个源下的所有文章的已读标记
 * @params streamId 源 ID
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
 * @params id 文章 ID
 * @params isStar 是否添加收藏标记
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
 * @params id 文章 ID
 * @returns 
 */
export function markArticleAsRead(id: string | string[], asUnread?: boolean) {
  const params: MarkArticleParmas = { i: id };
  params[asUnread ? "r" : "a"] = SystemStreamIDs.READ;
  return fetch.post(`/reader/api/0/edit-tag`, null, {
    params: params,
  });
}