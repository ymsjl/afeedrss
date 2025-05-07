import fetch from "../fetch";
import { makeInoreaderUrl } from "../make-inoreader-url";
import { UserInfoResponse } from "./user.types";

export const endpoints = {
  authorization: '/oauth2/auth',
  getAccessToken: '/oauth2/token',
  getUserInfo: '/user-info',
};

function getUserInfo() {
  return fetch.get<UserInfoResponse>(makeInoreaderUrl(endpoints.getUserInfo) );
}

export default {
  getUserInfo
}