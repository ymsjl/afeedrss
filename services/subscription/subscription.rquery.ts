import { normalize } from "normalizr";
import { queryOptions } from "@tanstack/react-query";
import { QUERY_KEYS } from "../constants";
import subscriptionApi from "./subscription.endpoints";
import { FolderOrTag, Subscription, SubscriptionEntity, FolderEntity } from "./subscription.types";
import { folderSchema, subscriptionSchema } from "./subscription.entity";

export const subscriptionsQueryOptions = queryOptions({
  queryKey: [QUERY_KEYS.SUBSCRIPTIONS_LIST],
  queryFn: async () => {
    const subscriptionList = await subscriptionApi.getSubscriptionList();
    const subscriptions = subscriptionList.data.subscriptions;
    const subscriptionsNormalized = normalize<
      Subscription,
      SubscriptionEntity,
      string[]
    >(subscriptions, [subscriptionSchema]);
    return subscriptionsNormalized;
  }
});

export const folderQueryOptions = queryOptions({
  queryKey: [QUERY_KEYS.FOLDER],
  queryFn: async () => {
    const res = await subscriptionApi.getFolderOrTagList({ types: 1, counts: 1 });
    const tags = res.data.tags;
    const foldersNormalized = normalize<FolderOrTag, FolderEntity, string[]>(
      tags,
      [folderSchema]
    );
    return foldersNormalized;
  }
});