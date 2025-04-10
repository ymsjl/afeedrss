import NextAuth from "next-auth";
import { Provider } from "next-auth/providers";

const INOREADER_SERVER_URL = process.env.INOREADER_SERVER_URL;

const inoreaderOauthProvider: Provider = {
  id: "inoreader",
  name: "inoreader",
  type: "oauth",
  authorization: {
    // 请求授权码的URL
    url: `${INOREADER_SERVER_URL}/oauth2/auth`,
    params: { scope: "read write" },
  },
  // 请求token的URL
  token: `${INOREADER_SERVER_URL}/oauth2/token`,
  // 请求用户信息的URL
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

export default NextAuth({
  providers: [inoreaderOauthProvider],
  callbacks: {
    async jwt({ token, account }) {
      // Persist the OAuth access_token to the token right after signin
      if (account) {
        token.accessToken = account.access_token;
      }
      return token;
    },
    async session({ session, token }) {
      // Send properties to the client, like an access_token from a provider.
      session.accessToken = token.accessToken as string;
      session.user = {
        id: token.sub,
        name: token.name,
        email: token.email,
      };
      return session;
    },
  },
  pages: {
    signIn: '/auth/signin', // 登录页面的URL
    signOut: '/auth/signout', // 退出登录页面的URL
  }
});
