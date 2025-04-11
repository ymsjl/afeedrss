import { fetch } from "../index";
import { Subscription } from "./../../types";
import { FeedActionType } from "./types";
import { InoreaderTag } from "../../types";

export interface SubscriptionListResponse {
  subscriptions: Subscription[];
}

/**
 * 添加订阅源
 * @params
 * @returns
 */
export function addSubscription(url: string, folder?: string) {
  return fetch.get(`/reader/api/0/subscription/edit`, {
    params: {
      ac: FeedActionType.subscribe,
      s: url,
      a: folder || "",
    },
  });
}

/**
 * 退订订阅源
 * @params
 * @returns 
 */
export function unsubscription(streamId: string) {
  return fetch.get(`/reader/api/0/subscription/edit`, {
    params: {
      ac: FeedActionType.unsubscribe,
      s: streamId,
    },
  });
}

/**
 * 重命名订阅源
 * @params
 * @returns 
 */
export function renameSubscription(streamId: string, title: string) {
  return fetch.get(`/reader/api/0/subscription/edit`, {
    params: {
      ac: FeedActionType.edit,
      s: streamId,
      t: title,
    },
  });
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
export function getFolderOrTagList(types?: number, counts?: number) {
  return fetch.get<InoreaderTagListResponse>(`/reader/api/0/tag/list`, {
    params: {
      types: types,
      counts: counts,
    },
  });
}
