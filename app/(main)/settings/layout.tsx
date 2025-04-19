import { authOptions } from "@/app/api/auth/[...nextauth]/auth-options";
import { ServerSessionProvider } from "@/app/providers/ServerSessionProvider";
import { getServerSession } from "next-auth";
import { PropsWithChildren } from "react";

export default async function  Layout({ children }: PropsWithChildren<{}>) {
  const session = await getServerSession(authOptions)
  return (
    <ServerSessionProvider session={session}>
      {children}
    </ServerSessionProvider>
  )
}