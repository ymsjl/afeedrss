import fetch from "@services/fetch";
import { StreamContentsParams, StreamPreferenceListResponse, StreamContentsResponse, StreamItemsIdsResponse, MarkArticleParmas, StreamItemsIdsParams } from "./stream.types";

export const endpoints = {
  getStreamContents: `/stream/contents`,
  getStreamItemIds: `/stream/items/ids`,
  getStreamPreferenceList: `/preference/stream/list`,
  markAllAsRead: `/mark-all-as-read`,
  editArticleTag: `/edit-tag`,
}

/**
 * 获取流的文章列表
 */
function getStreamContents(
  streamId: string,
  { exclude, continuation }: any | undefined
) {
  return fetch.get<StreamContentsResponse, StreamContentsParams>(
    `${endpoints.getStreamContents}/${encodeURIComponent(streamId)}`,
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

/**
 * 获取流的文章 ID 列表
 * @param streamId 流 ID
 * @param exclude 排除的流 ID
 * @param continuation 分页参数
 * @returns 文章 ID 列表
 */
function getStreamItemIds(
  streamId: string,
  { exclude, continuation }: any | undefined
) {
  return fetch.get<StreamItemsIdsResponse, StreamItemsIdsParams>(
    endpoints.getStreamItemIds,
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
function getStreamPreferenceList() {
  return fetch.get<StreamPreferenceListResponse>(endpoints.getStreamPreferenceList);
}

/**
 * 将某个流下的所有的文章标记为已读
 * @params streamId 源 ID
 * @returns 
 */
function markAllAsRead(streamId: string) {
  return fetch.post(endpoints.markAllAsRead, null, {
    params: {
      ts: Date.now(),
      s: streamId,
    },
  });
}

/**
 * 添加/移除文章的已读标记
 * @params id 文章 ID
 * @returns 
 */
function editArticleTag(id: string | string[], tag: string, addOrRemove: boolean) {
  const params: MarkArticleParmas = { i: id };
  params[addOrRemove ? "a" : "r"] = tag;
  return fetch.post(endpoints.editArticleTag, null, {
    params: params,
  });
}

export default {
  getStreamContents,
  getStreamItemIds,
  getStreamPreferenceList,
  markAllAsRead,
  editArticleTag,
}