import { NextAuthOptions } from "next-auth";
import { inoreaderOauthProvider } from "./oauth-provider-inoreader";

export const authOptions: NextAuthOptions = {
  providers: [inoreaderOauthProvider],
  secret: process.env.NEXTAUTH_SECRET,
  debug: true, // 添加此行以启用 next-auth 的调试日志
  logger: { // 添加此 logger 配置以捕获更详细的日志
    error(code, metadata) {
      console.error(`NextAuth Error - Code: ${code}`, metadata);
    },
  },
  callbacks: {
    async jwt({ token, account }) {
      if (account) {
        token.accessToken = account.access_token;
      }
      return token;
    },
    async session({ session, token, ...args }) {
      session.accessToken = token.accessToken as string;
      session.user = {
        id: token.sub ?? '',
        name: token.name ?? '',
        email: token.email ?? '',
      };
      return session;
    },
  },
  pages: {
    signIn: '/auth/signin',
    signOut: '/auth/signout',
  },
};
