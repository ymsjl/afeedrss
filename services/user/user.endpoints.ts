import fetch from "../fetch";
import { UserInfoResponse } from "./user.types";

export const endpoints = {
  authorization: `${process.env.NEXT_PUBLIC_INOREADER_SERVER_URL}/oauth2/auth`,
  getAccessToken: `${process.env.NEXT_PUBLIC_INOREADER_SERVER_URL}/oauth2/token`,
  getUserInfo: `/user-info`,
};

function getUserInfo() {
  return fetch.get<UserInfoResponse>(endpoints.getUserInfo);
}

export default {
  getUserInfo
}