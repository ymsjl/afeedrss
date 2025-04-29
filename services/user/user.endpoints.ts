import fetch from "../fetch";
import { readerBaseUrl } from "../constants";
import { UserInfoResponse } from "./user.types";

export const endpoints = {
  getAccessToken: `${process.env.INOREADER_SERVER_URL}/oauth2/token`,
  getUserInfo: `${readerBaseUrl}/user-info`,
};

function getUserInfo() {
  return fetch.get<UserInfoResponse>(endpoints.getUserInfo);
}

export default {
  getUserInfo
}