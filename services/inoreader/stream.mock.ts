import { delay, HttpResponse, HttpResponseResolver } from 'msw'
import { FeedActionType, SystemStreamIDs, IdValuePair, StreamContentsResponse } from "./stream.types"
import { db } from '../mock/db'
import { addTagToArticle, removeTagFromArticle, isArticleRead, isArticleStarred } from './utils'

export const getStreamContentsMock: HttpResponseResolver = async ({ request }) => {
  const url = new URL(request.url)
  const streamId = url.pathname.split('/').pop() || ''

  // 解析请求参数
  const excludeTarget = url.searchParams.get('xt') || ''
  const continuation = url.searchParams.get('c') || ''
  const numberOfItems = parseInt(url.searchParams.get('n') || '20', 10)

  let articles: any[] = []

  // 获取特定订阅源的文章
  if (streamId.startsWith('feed/')) {
    const feed = db.feed.findFirst({
      where: {
        id: { equals: streamId },
      }
    })

    if (feed) {
      articles = db.article.findMany({
        where: { origin: { id: { equals: streamId } } },
        take: numberOfItems
      })
    }
  } else if (streamId === SystemStreamIDs.STARRED) {
    // 获取所有加星标的文章
    const starredTag = db.tag.findFirst({
      where: { id: { equals: SystemStreamIDs.STARRED } }
    })

    if (starredTag && starredTag.articles) {
      // 从标签关系中获取文章
      articles = starredTag.articles.slice(0, numberOfItems)
    }
  } else {
    // 获取所有文章
    articles = db.article.findMany({ take: numberOfItems })
  }

  // 处理exclude标记（跳过已读文章）
  if (excludeTarget === SystemStreamIDs.READ) {
    articles = articles.filter(article => !isArticleRead(article.id))
  }

  // 将文章转换为响应格式
  const items: StreamContentsResponse['items'] = articles.map(article => {
    const origin = article.origin || { id: '', title: '' }

    return {
      id: article.id,
      title: article.title,
      published: article.published,
      summary: article.summary,
      origin: {
        streamId: origin.id,
        title: origin.title,
        htmlUrl: origin.htmlUrl || '',
      },
      author: article.author || '',
      timestampUsec: article.timestampUsec || '',
      crawlTimeMsec: article.crawlTimeMsec || '',
      updated: article.updated || article.published,
      isRead: isArticleRead(article.id),
      isStarred: isArticleStarred(article.id),
      alternate: [],
      annotations: [],
      categories: [],
      comments: [],
      commentsNum: 0,
      likingUsers: [],
      canonical: [],
      direction: 'ltr',
      self: { href: '' }
    }
  })

  // 找到相关的Feed信息
  let feedTitle = 'All Items'
  if (streamId.startsWith('feed/')) {
    const feed = db.feed.findFirst({ where: { id: { equals: streamId } } })
    if (feed) {
      feedTitle = feed.title
    }
  } else if (streamId === SystemStreamIDs.STARRED) {
    feedTitle = 'Starred Items'
  }

  await delay(1000)
  return HttpResponse.json<StreamContentsResponse>({
    direction: 'ltr',
    id: streamId || 'user/-/state/com.google/reading-list',
    title: feedTitle,
    items,
    continuation: 'mock-continuation-token',
    self: {
      href: ''
    },
    description: '',
    updated: Date.now(),
  })
}

export const getStreamPreferenceListMock: HttpResponseResolver = () => {
  const streamPrefList = db.streamPref.findMany({})
  const streamprefs = streamPrefList.reduce((acc, pref) => {
    acc[pref.id] = JSON.parse(pref.value) as IdValuePair[]
    return acc
  }, {} as Record<string, IdValuePair[]>)
  return HttpResponse.json({ streamprefs })
}

export const markAllAsReadMock: HttpResponseResolver = ({ request }) => {
  const url = new URL(request.url)
  const streamId = url.searchParams.get('s') || ''

  let articlesToMark: any[] = []

  if (streamId && streamId.startsWith('feed/')) {
    // 获取指定订阅源的所有文章
    const feed = db.feed.findFirst({
      where: { id: { equals: streamId } }
    })

    if (feed) {
      articlesToMark = db.article.findMany({
        where: { origin: { id: { equals: streamId } } }
      })
    }
  } else {
    // 获取所有未读文章
    articlesToMark = db.article.findMany({}).filter(article => !isArticleRead(article.id))
  }

  // 为每篇文章添加已读标签
  articlesToMark.forEach(article => {
    addTagToArticle(article.id, SystemStreamIDs.READ)
  })

  return HttpResponse.json({ success: true })
}

export const markArticleAsReadMock: HttpResponseResolver = ({ request }) => {
  const url = new URL(request.url)
  const action = url.searchParams.get('a')
  const articleIds = url.searchParams.get('i')

  if ((action === FeedActionType.markAsRead || action === FeedActionType.markAsUnread) && articleIds) {
    const ids = articleIds.split(',')

    ids.forEach(articleId => {
      if (action === FeedActionType.markAsRead) {
        // 添加已读标签
        addTagToArticle(articleId, SystemStreamIDs.READ)
      } else {
        // 移除已读标签
        removeTagFromArticle(articleId, SystemStreamIDs.READ)
      }
    })

    return HttpResponse.json({ success: true })
  }

  return HttpResponse.json({ success: false }, { status: 400 })
}

export const markArticleAsStarMock: HttpResponseResolver = ({ request }) => {
  const url = new URL(request.url)
  const action = url.searchParams.get('a')
  const articleIds = url.searchParams.get('i')

  if ((action === FeedActionType.markAsStar || action === FeedActionType.markAsUnstar) && articleIds) {
    const ids = articleIds.split(',')

    ids.forEach(articleId => {
      if (action === FeedActionType.markAsStar) {
        // 添加星标标签
        addTagToArticle(articleId, SystemStreamIDs.STARRED)
      } else {
        // 移除星标标签
        removeTagFromArticle(articleId, SystemStreamIDs.STARRED)
      }
    })

    return HttpResponse.json({ success: true })
  }

  return HttpResponse.json({ success: false }, { status: 400 })
}