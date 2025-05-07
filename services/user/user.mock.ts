import { HttpResponse, http } from 'msw'
import { db } from '../mock/db'
import { USER_ID } from '../mock/seed-db'
import { endpoints } from './user.endpoints';
import { makeInoreaderUrl } from "../make-inoreader-url";

const mockHandlers = [
  // http.post(endpoints.authorization, authorization),
  // http.post(endpoints.getAccessToken, getAccessTokenMock),
  http.get(makeInoreaderUrl({pathname: endpoints.getUserInfo, proxy: false}), getUserInfoMock),
];

export default mockHandlers;

function authorization() {
  return new Response(null, {
    status: 302,
    headers: { Location: `${process.env.REDIRECT_URI}?code=mock-code`, },
  });
}

function getAccessTokenMock() {
  const oauthResponse = {
    access_token: '1000000',
    token_type: "bearer",
    expires_in: 3600,
    refresh_token: "mock-refresh-token",
    scope: "read write"
  };
  return HttpResponse.json(oauthResponse, { status: 200 });
}

function getUserInfoMock() {
  const user = db.user.findFirst({
    where: {
      id: { equals: USER_ID },
    },
  });
  const token = {
    name: user?.userName,
    email: user?.userEmail,
    sub: user?.id,
    accessToken: '10000000',
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + 3600, // 1 hour
    jti: 'mock-jwt-id'
  }
  return HttpResponse.json(token, { status: 200 })
}
