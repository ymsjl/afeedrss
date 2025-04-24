import { delay, HttpResponse, HttpResponseResolver, } from 'msw'
import { FeedActionType } from "./stream.types"
import { db } from '../mock/db'
import { InoreaderTagListResponse, SubscriptionListResponse } from "./subscription.types"
import { InoreaderTagType } from "./subscription.types"
import { getTagNameFromId } from '@/app/(main)/_components/feed-side-nav/create-nav';
import { joinBewteenFeedAndTag } from '../mock/utils'

export const getSubscriptionListMock: HttpResponseResolver = async () => {
  const subscriptions = db.feed.findMany({}).map(
    feed => {
      let folders = [];
      for (let feedTag of feed.tags) {
        const result = db.tag.findFirst({ where: { id: { equals: feedTag.id }, type: { equals: "folder" } } })
        if (result) {
          folders.push(result);
        }
      }
      return ({
        id: feed.id,
        title: feed.title,
        htmlUrl: feed.htmlUrl,
        firstitemmsec: feed.firstitemmsec,
        url: feed.url,
        categories: folders.map(folder => ({
          id: folder.id,
          label: getTagNameFromId(folder.id)
        })),
        iconUrl: feed.iconUrl,
        unread_count: 0, // TODO: 实际未读数
        sortid: feed.sortid
      })
    }
  )
  await delay(1000) // 模拟延迟
  return HttpResponse.json<SubscriptionListResponse>({ subscriptions })
}

export const getFolderOrTagListMock: HttpResponseResolver = async () => {
  const tags = db.tag.findMany({}).map((tag) => {
    return {
      id: tag.id,
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

    if (!existingFeed) {
      // 创建新的订阅
      const newFeed = db.feed.create({
        id: feedId,
        title: `Feed from ${feedUrl}`,
        url: feedUrl,
        htmlUrl: feedUrl,
        tags: [],
        iconUrl: `${new URL(feedUrl).origin}/favicon.ico`,
      })
      const folder = db.tag.findFirst({
        where: {
          id: { equals: folderId },
          type: { equals: 'folder' }
        }
      });

      if (folder) {
        const feedTag = db.feedTag.create(joinBewteenFeedAndTag(feedId, folder.id))
        db.feed.update({
          where: {
            id: { equals: feedId }
          },
          data: {
            tags: [feedTag]
          }
        })
        db.tag.update({
          where: {
            id: { equals: folderId }
          },
          data: {
            feeds: [...folder.feeds, feedTag]
          }
        })
      }
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