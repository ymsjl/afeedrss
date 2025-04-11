import { HttpResponse, HttpResponseResolver } from 'msw'
import { FeedActionType } from './types'

export const getSubscriptionListMock: HttpResponseResolver = () => {
  return HttpResponse.json({
    subscriptions: [
      {
        id: 'feed/mock-feed-1',
        title: 'Mock Feed 1',
        categories: [
          { id: 'user/mock-user/label/folder1', label: 'Folder 1' }
        ],
        url: 'https://mock-feed-1.com/feed',
        htmlUrl: 'https://mock-feed-1.com',
        iconUrl: 'https://mock-feed-1.com/favicon.ico'
      },
      {
        id: 'feed/mock-feed-2',
        title: 'Mock Feed 2',
        categories: [
          { id: 'user/mock-user/label/folder2', label: 'Folder 2' }
        ],
        url: 'https://mock-feed-2.com/feed',
        htmlUrl: 'https://mock-feed-2.com',
        iconUrl: 'https://mock-feed-2.com/favicon.ico'
      }
    ]
  })
}

export const getFolderOrTagListMock: HttpResponseResolver = () => {
  return HttpResponse.json({
    tags: [
      {
        id: 'user/mock-user/label/folder1',
        type: 'folder',
        unread_count: 5
      },
      {
        id: 'user/mock-user/label/folder2',
        type: 'folder',
        unread_count: 3
      }
    ]
  })
}

export const addSubscriptionMock: HttpResponseResolver = ({ request }) => {
  const url = new URL(request.url)
  const action = url.searchParams.get('ac')
  const feedUrl = url.searchParams.get('s')
  const folder = url.searchParams.get('a')

  if (action === FeedActionType.subscribe && feedUrl) {
    return HttpResponse.json({ success: true })
  }
  return HttpResponse.json({ success: false }, { status: 400 })
}

export const unsubscriptionMock: HttpResponseResolver = ({ request }) => {
  const url = new URL(request.url)
  const action = url.searchParams.get('ac')
  const streamId = url.searchParams.get('s')

  if (action === FeedActionType.unsubscribe && streamId) {
    return HttpResponse.json({ success: true })
  }
  return HttpResponse.json({ success: false }, { status: 400 })
}

export const renameSubscriptionMock: HttpResponseResolver = ({ request }) => {
  const url = new URL(request.url)
  const action = url.searchParams.get('ac')
  const streamId = url.searchParams.get('s')
  const title = url.searchParams.get('t')

  if (action === FeedActionType.edit && streamId && title) {
    return HttpResponse.json({ success: true })
  }
  return HttpResponse.json({ success: false }, { status: 400 })
}