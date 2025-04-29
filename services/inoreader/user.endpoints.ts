import { fetch } from "../index";
import { readerBaseUrl } from "./constants";
import { UserInfoResponse } from "./user.types";

export const endpoints = {
  getAccessToken: `${process.env.INOREADER_SERVER_URL}/oauth2/token`,
  getUserInfo: `${readerBaseUrl}/user-info`,
};

/**
 * 获取用户信息
 * @returns
 */
export function getUserInfo() {
  return fetch.get<UserInfoResponse>(`${readerBaseUrl}/user-info`);
}
