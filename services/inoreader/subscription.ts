import { fetch, } from "../index";
import { FeedActionType } from "./stream.types";
import { SubscriptionEditParams, SubscriptionListResponse, FolderTagListParams, InoreaderTagListResponse } from "./subscription.types";

/**
 * 添加订阅源
 * @params url 订阅源地址
 * @params folder 订阅源文件夹 ID
 * @returns
 */
export function addSubscription(url: string, folder?: string) {
  const params: SubscriptionEditParams = {
    ac: FeedActionType.subscribe,
    s: url,
    a: folder || "",
  };
  return fetch.get<string, SubscriptionEditParams>(`/reader/api/0/subscription/edit`, { params });
}

/**
 * 退订订阅源
 * @params streamId 订阅源 ID
 * @returns 
 */
export function unsubscription(streamId: string) {
  const params: SubscriptionEditParams = {
    ac: FeedActionType.unsubscribe,
    s: streamId,
  };
  return fetch.get<string, SubscriptionEditParams>(`/reader/api/0/subscription/edit`, { params });
}

/**
 * 重命名订阅源
 * @params streamId 订阅源 ID
 * @params title 订阅源名称
 * @returns
 */
export function renameSubscription(streamId: string, title: string) {
  const params: SubscriptionEditParams = {
    ac: FeedActionType.edit,
    s: streamId,
    t: title,
  };
  return fetch.get<string, SubscriptionEditParams>(`/reader/api/0/subscription/edit`, { params });
}

/**
 * 获取订阅列表
 * @returns
 */
export function getSubscriptionList() {
  return fetch.get<SubscriptionListResponse>(`/reader/api/0/subscription/list`);
}

/**
 * 获取文件夹或标签列表
 * @params params 文件夹或标签列表参数
 * @params params.types 0: 文件夹, 1: 标签, 2: 系统标签
 * @params params.counts 是否包含未读数量
 * @returns 
 */
export function getFolderOrTagList(params?: FolderTagListParams) {
  return fetch.get<InoreaderTagListResponse, FolderTagListParams>(`/reader/api/0/tag/list`, { params });
}
