import { useMemo } from "react";
import SubscriptionNavTreeBuilder from "./subscriptionNavTreeBuilder";
import { useStreamPreferencesQuery, useSubscriptionsListQuery, useFolderQuery } from "./utils";
import { useSession } from "next-auth/react";

export const useSourcePanelData = () => {
  const { data: session } = useSession();
  const userId = session?.user?.id || "";
  const streamPreferencesQuery = useStreamPreferencesQuery();
  const folderQuery = useFolderQuery();
  const subscriptionsListQuery = useSubscriptionsListQuery();

  const subscriptionsListData = subscriptionsListQuery.data;
  const folderData = folderQuery.data;
  const streamPreferencesData = streamPreferencesQuery.data;

  const data = useMemo(() => {
    if (
      !userId ||
      !subscriptionsListData ||
      !folderData ||
      !streamPreferencesData
    ) {
      return null;
    }
    return new SubscriptionNavTreeBuilder({
      userId,
      subscriptionById: subscriptionsListData.entities.subscription,
      tagsById: folderData.entities.folder,
      streamPrefById: streamPreferencesData.streamprefs,
    }).build();
  }, [userId, subscriptionsListData, folderData, streamPreferencesData]);

  return useMemo(
    () => ({
      data,
    }),
    [data]
  );
};