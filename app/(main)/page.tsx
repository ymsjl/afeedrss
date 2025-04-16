import { extractFirst } from "@/utils";
import HomePageClient from "./pageClient";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../api/auth/[...nextauth]/auth-options";
import { getQueryClient } from "@/utils/getQueryClient";
import { HydrationBoundary, dehydrate } from "@tanstack/react-query";
import { getStreamContentQueryKey } from "@/components/StreamContentPanel/getStreamContentQueryKey";
import { redirect } from "next/navigation";
import { makeStreamContentQueryOptions } from "@server/inoreader/stream.rquery";
import {
  folderQueryOptions,
  streamPreferencesQueryOptions,
  subscriptionsQueryOptions,
} from "@/server/inoreader/subscription.rquery";

export default async function Home({
  params,
  searchParams,
}: {
  params: { slug: string };
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const queryClient = getQueryClient();
  const session = await getServerSession(authOptions);
  const userId = session?.user.id || "";
  const streamId = extractFirst(searchParams.streamId);
  const unreadOnly = !!extractFirst(searchParams.unreadOnly);

  if (!session?.user.id) {
    redirect("/auth/signin");
  }

  const streamContentQueryKey = getStreamContentQueryKey({
    userId,
    streamId,
    unreadOnly,
  });
  queryClient.prefetchInfiniteQuery(
    makeStreamContentQueryOptions(streamContentQueryKey)
  );
  queryClient.prefetchQuery(subscriptionsQueryOptions);
  queryClient.prefetchQuery(streamPreferencesQueryOptions);
  queryClient.prefetchQuery(folderQueryOptions);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <HomePageClient />
    </HydrationBoundary>
  );
}
