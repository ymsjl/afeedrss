import { NextAuthOptions } from "next-auth";
import { Provider } from "next-auth/providers";

const INOREADER_SERVER_URL = process.env.INOREADER_SERVER_URL;

export const inoreaderOauthProvider: Provider = {
  id: "inoreader",
  name: "inoreader",
  type: "oauth",
  authorization: {
    url: `${INOREADER_SERVER_URL}/oauth2/auth`,
    params: { scope: "read write" },
  },
  token: `${INOREADER_SERVER_URL}/oauth2/token`,
  userinfo: `${INOREADER_SERVER_URL}/reader/api/0/user-info`,
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
  profile(profile: {
    userId: string;
    userName: string;
    userEmail: string;
  }) {
    return {
      id: profile?.userId,
      name: profile?.userName,
      email: profile?.userEmail,
    };
  },
}

export const authOptions: NextAuthOptions = {
  providers: [inoreaderOauthProvider],
  secret: process.env.NEXTAUTH_SECRET,
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
  }
};
