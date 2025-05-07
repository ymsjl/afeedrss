import { delay, HttpResponse, http } from 'msw'
import { FeedActionType } from "./subscription.types"
import { db } from '@services/mock/db'
import { getTagNameFromId } from '@/app/(main)/_components/feed-side-nav/create-nav';
import { joinBewteenFeedAndTag } from '@services/mock/utils'
import { endpoints } from './subscription.endpoints';
import { makeInoreaderUrl } from "../make-inoreader-url";


const mockHandlers = [
  http.get(makeInoreaderUrl({ pathname: endpoints.editSubscriptionTag, proxy: false }), function (...args) {
    const { request } = args[0];
    const url = new URL(request.url);
    const action = url.searchParams.get('ac');
    const subscriptionId = url.searchParams.get('s') || '';

    switch (action) {
      case FeedActionType.subscribe:
        return addSubscriptionMock({ subscriptionId, folderId: url.searchParams.get('a') || '' });
      case FeedActionType.unsubscribe:
        return unsubscriptionMock({ subscriptionId });
      case FeedActionType.edit:
        return renameSubscriptionMock({ subscriptionId: subscriptionId, title: url.searchParams.get('t') || '' });
      default:
        return new HttpResponse(null, { status: 400 });
    }
  }),
  http.get(makeInoreaderUrl({ pathname: endpoints.getSubscriptionList, proxy: false }), getSubscriptionListMock),
  http.get(makeInoreaderUrl({ pathname: endpoints.getFolderOrTagList, proxy: false }), getFolderOrTagListMock),
];

export default mockHandlers

async function getSubscriptionListMock(): Promise<HttpResponse> {
  const subscriptions = db.feed.findMany({}).map(
    feed => {
      let folders = [];
      for (let feedTag of feed.tags) {
        const result = db.tag.findFirst({ where: { id: { equals: feedTag.id }, type: { equals: "folder" } } });
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
        sortid: feed.sortid,
        description: feed.description
      });
    }
  );
  await delay(1000); // 模拟延迟
  return HttpResponse.json({ subscriptions });
}

async function getFolderOrTagListMock(): Promise<HttpResponse> {
  const tags = db.tag.findMany({}).map((tag) => {
    return {
      id: tag.id,
      type: tag.type,
      unread_count: tag.unread_count,
      sortid: tag.sortid
    };
  });
  await delay(1000); // 模拟延迟
  return HttpResponse.json({ tags });
}

function addSubscriptionMock({ subscriptionId, folderId }: { subscriptionId: string, folderId: string }) {
  // 生成一个新的订阅ID
  const feedId = `feed/${subscriptionId.replace(/[^a-z0-9]/gi, '-').toLowerCase()}`;
  const existingFeed = db.feed.findFirst({ where: { url: { equals: subscriptionId } } });
  if (existingFeed) return HttpResponse.json({ success: true, feed: existingFeed });

  const folder = db.tag.findFirst({
    where: {
      id: { equals: folderId },
      type: { equals: 'folder' }
    }
  });

  if (!folder) return HttpResponse.json({ success: false, message: 'Folder not found', status: 404 });

  // 创建新的订阅
  const newFeed = db.feed.create({
    id: feedId,
    title: `Feed from ${subscriptionId}`,
    url: subscriptionId,
    htmlUrl: subscriptionId,
    tags: [],
    iconUrl: `${new URL(subscriptionId).origin}/favicon.ico`,
  });
  const feedTag = db.feedTag.create(joinBewteenFeedAndTag(feedId, folder.id));
  db.feed.update({
    where: {
      id: { equals: feedId }
    },
    data: {
      tags: [feedTag]
    }
  });
  db.tag.update({
    where: {
      id: { equals: folderId }
    },
    data: {
      feeds: [...folder.feeds, feedTag]
    }
  });
  return HttpResponse.json({ success: true, feed: newFeed });
}

function unsubscriptionMock({ subscriptionId }: { subscriptionId: string }) {
  const feed = db.feed.findFirst({ where: { id: { equals: subscriptionId } } })
  if (!feed) return HttpResponse.json({ success: false, message: 'Feed not found', status: 404 })
  db.feed.delete({ where: { id: { equals: subscriptionId } } })
  return HttpResponse.json({ success: true })
}

function renameSubscriptionMock({ subscriptionId, title }: { subscriptionId: string, title: string }) {
  // 查找并更新订阅标题
  const feed = db.feed.findFirst({ where: { id: { equals: subscriptionId } } })
  if (!feed) return HttpResponse.json({ success: false, message: 'Feed not found', status: 404 })
  db.feed.update({ where: { id: { equals: subscriptionId } }, data: { title } })
  return HttpResponse.json({ success: true })
}
