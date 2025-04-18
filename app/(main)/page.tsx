import { extractFirst } from "@/utils";
import HomePageClient from "./pageClient";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../api/auth/[...nextauth]/auth-options";
import { ReactQueryStreamedHydration } from "@tanstack/react-query-next-experimental";
import { getStreamContentQueryKey } from "@/components/StreamContentPanel/getStreamContentQueryKey";
import { ServerSessionProvider } from '@/app/providers/ServerSessionProvider';
import { redirect } from "next/navigation";

export default async function Home({
  params,
  searchParams,
}: {
  params: { slug: string };
  searchParams: { [key: string]: string | string[] | undefined };
}) {
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

  return (
    <ServerSessionProvider session={session}>
      <ReactQueryStreamedHydration>
        <HomePageClient streamContentQueryKey={streamContentQueryKey} />
      </ReactQueryStreamedHydration>
    </ServerSessionProvider>
  );
}
