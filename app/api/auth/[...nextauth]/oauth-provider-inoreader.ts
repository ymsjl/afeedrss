import { makeInoreaderUrl } from "@/services/make-inoreader-url";
import { endpoints as userEndpoints } from "@/services/user/user.endpoints";
import { Provider } from "next-auth/providers";

export const inoreaderOauthProvider: Provider = {
  id: "inoreader",
  name: "inoreader",
  type: "oauth",
  authorization: {
    url: makeInoreaderUrl({ pathname: userEndpoints.authorization, baseUrl: '' }, false),
    params: { scope: "read write" },
  },
  token: makeInoreaderUrl({pathname: userEndpoints.getAccessToken, baseUrl: ''}, false),
  userinfo: makeInoreaderUrl(userEndpoints.getUserInfo, false),
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
};
