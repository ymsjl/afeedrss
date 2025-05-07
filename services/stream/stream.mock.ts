import { delay, HttpResponse, HttpResponseResolver, http } from 'msw'
import { db } from '@services/mock/db'
import { SystemStreamIDs, IdValuePair, StreamContentsResponse } from "./stream.types"
import { addTagToArticle, removeTagFromArticle, isArticleRead, isArticleStarred } from '@services/mock/utils'
import { endpoints } from './stream.endpoints'
import { makeInoreaderUrl } from "../make-inoreader-url"

const mockHandlers = [
  http.get(makeInoreaderUrl(`${endpoints.getStreamContents}/*`, false), getStreamContentsMock),

  http.get(makeInoreaderUrl(endpoints.getStreamPreferenceList, false), getStreamPreferenceListMock),

  http.post(makeInoreaderUrl(endpoints.markAllAsRead, false), markAllAsReadMock),

  http.post(makeInoreaderUrl(endpoints.editArticleTag, false), (...args) => editTag(...args)),
];

export default mockHandlers

async function getStreamContentsMock({ request }: Parameters<HttpResponseResolver>[0]) {
  const url = new URL(request.url);
  const streamId = decodeURIComponent(url.pathname.split('/').pop() || '')

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
      },
    })

    if (feed) {
      articles = db.article.findMany({
        where: { origin: { id: { equals: streamId } } },
        take: numberOfItems,
      })
    }
  } else if (streamId === SystemStreamIDs.STARRED) {
    // 获取所有加星标的文章
    const starredTag = db.tag.findFirst({
      where: { id: { equals: SystemStreamIDs.STARRED } },
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
    articles = articles.filter((article) => !isArticleRead(article.id))
  }

  // 将文章转换为响应格式
  const items: StreamContentsResponse['items'] = articles.map((article) => {
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
      self: { href: '' },
    };
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

function getStreamPreferenceListMock() {
  const streamPrefList = db.streamPref.findMany({})
  const streamprefs = streamPrefList.reduce((acc, pref) => {
    acc[pref.id] = JSON.parse(pref.value) as IdValuePair[]
    return acc
  }, {} as Record<string, IdValuePair[]>)
  return HttpResponse.json({ streamprefs })
}

function markAllAsReadMock({ request }: Parameters<HttpResponseResolver>[0]) {
  const url = new URL(request.url)
  const streamId = url.searchParams.get('s') || ''

  let articlesToMark: any[] = []

  if (streamId && streamId.startsWith('feed/')) {
    // 获取指定订阅源的所有文章
    const feed = db.feed.findFirst({
      where: { id: { equals: streamId } },
    })

    if (feed) {
      articlesToMark = db.article.findMany({
        where: { origin: { id: { equals: streamId } } },
      })
    }
  } else {
    // 获取所有未读文章
    articlesToMark = db.article.findMany({}).filter((article) => !isArticleRead(article.id))
  }

  // 为每篇文章添加已读标签
  articlesToMark.forEach((article) => {
    addTagToArticle(article.id, SystemStreamIDs.READ)
  })

  return HttpResponse.json({ success: true })
}

function editTag({ request }: Parameters<HttpResponseResolver>[0]) {
  const url = new URL(request.url)
  const tagToAdd = url.searchParams.get('a')
  const tagToRemove = url.searchParams.get('r')
  const articleIds = url.searchParams.get('i')

  if (!articleIds || articleIds.length === 0) {
    return HttpResponse.json({ success: false }, { status: 400 });
  }

  const ids = articleIds.split(',')

  ids.forEach((articleId) => {
    if (tagToAdd) {
      addTagToArticle(articleId, tagToAdd)
    } else if (tagToRemove) {
      removeTagFromArticle(articleId, tagToRemove)
    }
  })

  return HttpResponse.json({ success: true })
}
