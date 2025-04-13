import { fetch, } from "../index";
import { Subscription } from "../../types";
import { FeedActionType } from "./types";
import { InoreaderTag } from "../../types";

export interface SubscriptionListResponse {
  subscriptions: Subscription[];
}

interface SubscriptionEditParams {
  ac: FeedActionType;
  s: string;
  a?: string;
  t?: string;
}

interface FolderTagListParams {
  types?: number;
  counts?: number;
}

/**
 * 添加订阅源
 * @params
 * @returns
 */
export function addSubscription(url: string, folder?: string) {
  const params: SubscriptionEditParams = {
    ac: FeedActionType.subscribe,
    s: url,
    a: folder || "",
  };
  return fetch.get(`/reader/api/0/subscription/edit`, { params });
}

/**
 * 退订订阅源
 * @params
 * @returns 
 */
export function unsubscription(streamId: string) {
  const params: SubscriptionEditParams = {
    ac: FeedActionType.unsubscribe,
    s: streamId,
  };
  return fetch.get(`/reader/api/0/subscription/edit`, { params });
}

/**
 * 重命名订阅源
 * @params
 * @returns 
 */
export function renameSubscription(streamId: string, title: string) {
  const params: SubscriptionEditParams = {
    ac: FeedActionType.edit,
    s: streamId,
    t: title,
  };
  return fetch.get(`/reader/api/0/subscription/edit`, { params });
}

/**
 * 获取订阅列表
 * @returns
 */
export function getSubscriptionList() {
  return fetch.get<SubscriptionListResponse>(`/reader/api/0/subscription/list`);
}

export interface InoreaderTagListResponse {
  tags: InoreaderTag[];
}

/**
 * 获取文件夹或标签列表
 * @params
 * @returns 
 */
export function getFolderOrTagList(params?: FolderTagListParams) {
  return fetch.get<InoreaderTagListResponse>(`/reader/api/0/tag/list`, { params });
}
