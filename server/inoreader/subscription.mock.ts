import { delay, HttpResponse, HttpResponseResolver, } from 'msw'
import { FeedActionType } from "./stream.types"
import { db } from '../mock/db'
import { InoreaderTagListResponse, SubscriptionListResponse } from "./subscription.types"
import { InoreaderTagType } from "./subscription.types"

export const getSubscriptionListMock: HttpResponseResolver = async () => {
  const subscriptions = db.feed.findMany({}).map(
    feed => ({
      id: feed.id,
      title: feed.title,
      htmlUrl: feed.htmlUrl,
      firstitemmsec: feed.firstitemmsec,
      url: feed.url,
      categories: feed.tags.map(tag => ({
        id: tag.id,
        label: tag.label,
        type: tag.type,
        sortid: tag.sortid
      })),
      iconUrl: feed.iconUrl,
      unread_count: 0, // TODO: 实际未读数
      sortid: feed.sortid
    })
  )
  await delay(1000) // 模拟延迟
  return HttpResponse.json<SubscriptionListResponse>({ subscriptions })
}

export const getFolderOrTagListMock: HttpResponseResolver = async () => {
  const tags = db.tag.findMany({}).map((tag) => {
    return {
      id: tag.id,
      label: tag.label,
      type: tag.type as InoreaderTagType,
      unread_count: tag.unread_count,
      sortid: tag.sortid
    }
  })
  await delay(1000) // 模拟延迟
  return HttpResponse.json<InoreaderTagListResponse>({ tags })
}

export const addSubscriptionMock: HttpResponseResolver = ({ request }) => {
  const url = new URL(request.url)
  const action = url.searchParams.get('ac')
  const feedUrl = url.searchParams.get('s')
  const folderId = url.searchParams.get('a') ?? ''

  if (action === FeedActionType.subscribe && feedUrl) {
    // 生成一个新的订阅ID
    const feedId = `feed/${feedUrl.replace(/[^a-z0-9]/gi, '-').toLowerCase()}`

    // 检查订阅是否已存在
    const existingFeed = db.feed.findFirst({ where: { url: { equals: feedUrl } } })

    const folderTag = db.tag.findFirst({
      where: {
        id: { equals: folderId },
        type: { equals: 'folder' }
      }
    });

    if (!existingFeed) {
      // 创建新的订阅
      const newFeed = db.feed.create({
        id: feedId,
        title: `Feed from ${feedUrl}`,
        url: feedUrl,
        htmlUrl: feedUrl,
        tags: folderTag ? [folderTag] : [],
        iconUrl: `${new URL(feedUrl).origin}/favicon.ico`,
      })

      return HttpResponse.json({ success: true, feed: newFeed })
    }

    return HttpResponse.json({ success: true, feed: existingFeed })
  }

  return HttpResponse.json({ success: false }, { status: 400 })
}

export const unsubscriptionMock: HttpResponseResolver = ({ request }) => {
  const url = new URL(request.url)
  const action = url.searchParams.get('ac')
  const streamId = url.searchParams.get('s')

  if (action === FeedActionType.unsubscribe && streamId) {
    // 查找并删除订阅
    const feed = db.feed.findFirst({ where: { id: { equals: streamId } } })

    if (feed) {
      db.feed.delete({ where: { id: { equals: streamId } } })
      return HttpResponse.json({ success: true })
    }
  }

  return HttpResponse.json({ success: false }, { status: 400 })
}

export const renameSubscriptionMock: HttpResponseResolver = ({ request }) => {
  const url = new URL(request.url)
  const action = url.searchParams.get('ac')
  const streamId = url.searchParams.get('s')
  const title = url.searchParams.get('t')

  if (action === FeedActionType.edit && streamId && title) {
    // 查找并更新订阅标题
    const feed = db.feed.findFirst({ where: { id: { equals: streamId } } })

    if (feed) {
      db.feed.update({
        where: { id: { equals: streamId } },
        data: { title }
      })

      return HttpResponse.json({ success: true })
    }
  }

  return HttpResponse.json({ success: false }, { status: 400 })
}