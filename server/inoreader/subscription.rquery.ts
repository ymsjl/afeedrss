import { normalize, schema } from "normalizr";
import { queryOptions } from "@tanstack/react-query";
import { QUERY_KEYS } from "../../constants";
import service from "@server/index";
import { SubscriptionEntity, FolderEntity } from "../../types";
import { FolderOrTag } from "./subscription.types";
import { Subscription } from "./subscription.types";

const subscriptionSchema = new schema.Entity("subscription", undefined);
const folder = new schema.Entity("folder");

export const subscriptionsQueryOptions = queryOptions({
  queryKey: [QUERY_KEYS.SUBSCRIPTIONS_LIST],
  queryFn: async () => {
    const subscriptionList = await service.inoreader.getSubscriptionList();
    const subscriptions = subscriptionList.data.subscriptions;
    const subscriptionsNormalized = normalize<
      Subscription,
      SubscriptionEntity,
      string[]
    >(subscriptions, [subscriptionSchema]);
    return subscriptionsNormalized;
  }
});

export const streamPreferencesQueryOptions = queryOptions({
  queryKey: [QUERY_KEYS.STREAM_PREFERENCES],
  queryFn: async () => {
    const res = await service.inoreader.getStreamPreferenceList();
    return res.data;
  }
});

export const folderQueryOptions = queryOptions({
  queryKey: [QUERY_KEYS.FOLDER],
  queryFn: async () => {
    const res = await service.inoreader.getFolderOrTagList({ types: 1, counts: 1 });
    const tags = res.data.tags;
    const foldersNormalized = normalize<FolderOrTag, FolderEntity, string[]>(
      tags,
      [folder]
    );
    return foldersNormalized;
  }
});