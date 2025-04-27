import { http, HttpResponse } from 'msw'
import { getUserInfoMock } from '../inoreader/user.mock'
import { getStreamContentsMock, getStreamPreferenceListMock, markAllAsReadMock, markArticleAsReadMock, markArticleAsStarMock } from '../inoreader/stream.mock'
import { addSubscriptionMock, getFolderOrTagListMock, getSubscriptionListMock, renameSubscriptionMock, unsubscriptionMock } from '../inoreader/subscription.mock'
import { db } from './db'
import { USER_ID } from './seed-db'

const baseURL = `${process.env.INOREADER_SERVER_URL}/reader/api/0`

export const handlers = [
  // User APIs
  http.get(`${baseURL}/user-info`, getUserInfoMock),

  // Stream APIs
  http.get(`${baseURL}/stream/contents/*`, getStreamContentsMock),

  http.get(`${baseURL}/preference/stream/list`, getStreamPreferenceListMock),

  http.post(`${baseURL}/mark-all-as-read`, markAllAsReadMock),

  http.post(`${baseURL}/edit-tag`, (...args) => {
    const { request } = args[0]
    const url = new URL(request.url)
    const action = url.searchParams.get('a')
    if (action?.includes('starred')) {
      return markArticleAsStarMock(...args)
    }
    return markArticleAsReadMock(...args)
  }),

  // Subscription APIs
  http.get(`${baseURL}/subscription/edit`, (...args) => {
    const { request } = args[0]
    const url = new URL(request.url)
    const action = url.searchParams.get('ac')

    switch (action) {
      case 'subscribe':
        return addSubscriptionMock(...args)
      case 'unsubscribe':
        return unsubscriptionMock(...args)
      case 'edit':
        return renameSubscriptionMock(...args)
      default:
        return new HttpResponse(null, { status: 400 })
    }
  }),

  http.get(`${baseURL}/subscription/list`, getSubscriptionListMock),

  http.get(`${baseURL}/tag/list`, getFolderOrTagListMock),

  http.post(`${process.env.INOREADER_SERVER_URL}/oauth2/token`, (...args) => {
    console.log('mock token', args)
    const oauthResponse = {
      access_token: '1000000',
      token_type: "bearer",
      expires_in: 3600,
      refresh_token: "mock-refresh-token",
      scope: "read write"
    };
    return HttpResponse.json(oauthResponse, { status: 200 })
  }),

  http.get(`${process.env.INOREADER_SERVER_URL}/reader/api/0/user-info`, (...args) => {
    const user = db.user.findFirst({
      where: {
        id: { equals: USER_ID },
      },
    });
    console.log('用户是：', user)
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
  }),
]