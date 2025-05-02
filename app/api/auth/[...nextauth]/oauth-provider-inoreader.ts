import { endpoints as userEndpoints } from "@/services/user/user.endpoints";
import { Provider } from "next-auth/providers";

export const inoreaderOauthProvider: Provider = {
  id: "inoreader",
  name: "inoreader",
  type: "oauth",
  authorization: {
    url: userEndpoints.authorization,
    params: { scope: "read write" },
  },
  token: userEndpoints.getAccessToken,
  userinfo: `${process.env.NEXT_PUBLIC_INOREADER_SERVER_URL}/${userEndpoints.getUserInfo}`,
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
