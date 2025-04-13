import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import SubscriptionNavTreeBuilder from "./subscriptionNavTreeBuilder";
import { streamPreferencesQueryOptions, subscriptionsQueryOptions, folderQueryOptions } from "@server/inoreader/subscription.rquery";
import { useSession } from "next-auth/react";

export const useSourcePanelData = () => {
  const { data: session } = useSession();
  const userId = session?.user?.id || "";
  const streamPreferencesQuery = useQuery(streamPreferencesQueryOptions);
  const folderQuery = useQuery(folderQueryOptions);
  const subscriptionsQuery = useQuery(subscriptionsQueryOptions);

  const subscriptionsData = subscriptionsQuery.data;
  const folderData = folderQuery.data;
  const streamPreferencesData = streamPreferencesQuery.data;
  const data = useMemo(() => {
    if (
      !userId ||
      !subscriptionsData ||
      !folderData ||
      !streamPreferencesData
    ) {
      return null;
    }
  
    return new SubscriptionNavTreeBuilder({
      userId,
      subscriptionById: subscriptionsData.entities.subscription,
      tagsById: folderData.entities.folder,
      streamPrefById: streamPreferencesData.streamprefs,
    }).build();
  }, [userId, subscriptionsData, folderData, streamPreferencesData]);

  return useMemo(
    () => ({
      data,
    }),
    [data]
  );
};