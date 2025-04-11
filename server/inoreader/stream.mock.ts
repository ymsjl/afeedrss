import { HttpResponse, HttpResponseResolver } from 'msw'
import { FeedActionType } from './types'

export const getStreamContentsMock: HttpResponseResolver = () => {
  return HttpResponse.json({
    direction: 'ltr',
    id: 'feed/mock-feed-id',
    title: 'Mock Feed',
    items: [
      {
        id: 'mock-item-1',
        title: 'Mock Article 1',
        published: Date.now() - 86400000, // 1 day ago
        summary: { content: 'This is a mock article content' },
        origin: {
          streamId: 'feed/mock-feed-id',
          title: 'Mock Feed'
        }
      },
      {
        id: 'mock-item-2',
        title: 'Mock Article 2',
        published: Date.now() - 172800000, // 2 days ago
        summary: { content: 'This is another mock article content' },
        origin: {
          streamId: 'feed/mock-feed-id',
          title: 'Mock Feed'
        }
      }
    ],
    continuation: 'mock-continuation-token'
  })
}

export const getStreamPreferenceListMock: HttpResponseResolver = () => {
  return HttpResponse.json({
    streamprefs: {
      'feed/mock-feed-id': [
        { id: 'mock-pref-1', value: 'value1' },
        { id: 'mock-pref-2', value: 'value2' }
      ]
    }
  })
}

export const markAllAsReadMock: HttpResponseResolver = () => {
  return HttpResponse.json({ success: true })
}

export const markArticleAsReadMock: HttpResponseResolver = ({ request }) => {
  const url = new URL(request.url)
  const action = url.searchParams.get('a')
  const articleIds = url.searchParams.get('i')

  if (action === FeedActionType.markAsRead || action === FeedActionType.markAsUnread) {
    return HttpResponse.json({ success: true })
  }
  return HttpResponse.json({ success: false }, { status: 400 })
}

export const markArticleAsStarMock: HttpResponseResolver = ({ request }) => {
  const url = new URL(request.url)
  const action = url.searchParams.get('a')
  const articleIds = url.searchParams.get('i')

  if (action === FeedActionType.markAsStar || action === FeedActionType.markAsUnstar) {
    return HttpResponse.json({ success: true })
  }
  return HttpResponse.json({ success: false }, { status: 400 })
}