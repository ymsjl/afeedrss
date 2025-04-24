import { db } from './db';
import { SystemStreamIDs } from "../inoreader/stream.types";
import { feedStreamIdGenerator, generateArticleContent, joinBewteenFeedAndTag, makeSortIdGenerator, makeStreamIdGenerator } from './utils';

const articleTitles = [
  '新研究显示全球变暖趋势有所减缓，但挑战仍然严峻',
  '人工智能在医疗领域的应用前景',
  '区块链技术如何改变金融行业',
  '可再生能源的未来：太阳能和风能的崛起',
  '数字化转型：企业如何应对挑战与机遇',
  '全球经济复苏：各国政策的影响与展望',
  '教育公平：如何让每个孩子都能接受优质教育',
  '文化遗产保护：传统与现代的碰撞'
]

const TIME = 1745308167740

const subscriptionSourceIconUrl = 'https://placehold.co/32x32';

const USER_ID = '1006201176';

const feedSeeds = [
  {
    title: '36氪',
    url: 'https://36kr.com/feed',
    htmlUrl: 'https://36kr.com',
    iconUrl: subscriptionSourceIconUrl,
  },
  {
    title: '财经网',
    url: 'https://www.caijing.com.cn/rss/rss.xml',
    htmlUrl: 'https://www.caijing.com.cn',
    iconUrl: subscriptionSourceIconUrl,
  },

  {
    title: '新浪科技',
    url: 'https://tech.sina.com.cn/rss/technews.xml',
    htmlUrl: 'https://tech.sina.com.cn',
    iconUrl: subscriptionSourceIconUrl,
  },
  {
    title: '网易财经',
    url: 'https://money.163.com/special/0001386F/rss_newstop.xml',
    htmlUrl: 'https://money.163.com',
    iconUrl: subscriptionSourceIconUrl,
  },
  {
    title: '凤凰科技',
    url: 'https://tech.ifeng.com/rss/index.xml',
    htmlUrl: 'https://tech.ifeng.com',
    iconUrl: subscriptionSourceIconUrl,
  },
  {
    title: '搜狐财经',
    url: 'https://www.sohu.com/rss/finance.xml',
    htmlUrl: 'https://www.sohu.com',
    iconUrl: subscriptionSourceIconUrl,
  },
  {
    title: '腾讯科技',
    url: 'https://tech.qq.com/rss/index.xml',
    htmlUrl: 'https://tech.qq.com',
    iconUrl: subscriptionSourceIconUrl,
  },
  {
    title: '澎湃新闻',
    url: 'https://www.thepaper.cn/rss_all.xml',
    htmlUrl: 'https://www.thepaper.cn',
    iconUrl: subscriptionSourceIconUrl,
  },
  {
    title: '钛媒体',
    url: 'https://www.tmtpost.com/rss',
    htmlUrl: 'https://www.tmtpost.com',
    iconUrl: subscriptionSourceIconUrl,
  },
  {
    title: "南风窗",
    url: 'https://www.nfcmag.com/rss',
    htmlUrl: 'https://www.nfcmag.com',
    iconUrl: subscriptionSourceIconUrl,
  },
  {
    title: "南方周末",
    url: 'https://www.infzm.com/rss',
    htmlUrl: 'https://www.infzm.com',
    iconUrl: subscriptionSourceIconUrl,
  },
  {
    title: "新京报",
    url: 'https://www.bjnews.com.cn/rss',
    htmlUrl: 'https://www.bjnews.com.cn',
    iconUrl: subscriptionSourceIconUrl,
  }
]

/**
 * 创建模拟用户
 * @param userId 用户ID
 */
const seedUser = (userId: string) => {
  if (db.user.count() === 0) {
    db.user.create({
      id: userId,
      userName: 'Mock User',
      userProfileId: 'mock-profile-id',
      userEmail: 'mock@example.com',
      isBloggerUser: false,
      signupTimeSec: 1617235200, // 2021-04-01
      isMultiLoginEnabled: true
    });
  }
};


const folderSeeds = [
  {
    title: '科技新闻',
  },
  {
    title: '财经资讯',
  }
]

/**
 * 创建文件夹的排序数据
 */
const createFolderStreamPref = (
  id: string,
  sortValue: string
) => {
  db.streamPref.create({
    id,
    value: JSON.stringify([
      { id: 'subscription-ordering', value: sortValue }
    ])
  });
};

/**
 * 创建单个文章
 */
const createArticle = (feed: any, articleId: string, index: number, timestamp: number) => {
  const content = generateArticleContent(articleId);
  return db.article.create({
    id: articleId,
    title: articleTitles[index % articleTitles.length],
    published: timestamp,
    origin: feed,
    author: 'Another Author',
    timestampUsec: (timestamp).toString(),
    crawlTimeMsec: (timestamp + 3600000).toString(),
    content: content,
    summary: {
      direction: 'ltr',
      content: content,
    },
    updated: timestamp,
    tags: []
  });
};

/**
 * 创建导航树排序数据
 * @param tagIdGenerator 标签ID生成器
 */
const seedStreamPrefs = (tagIdGenerator: ReturnType<typeof makeStreamIdGenerator>) => {
  if (db.streamPref.count() !== 0) return;
  const folders = db.tag.findMany({ where: { type: { equals: 'folder' } } });
  const allFeeds = db.feed.getAll();
  folders.forEach((folder) => {
    const feedsOfFolder = allFeeds.filter((feed) => feed.tags.some((tag) => tag.tagId === folder.id));
    const sorting = feedsOfFolder.map((feed) => feed.sortid).join('');
    createFolderStreamPref(folder.id, sorting);
  })
  const uncategoriedFeeds = allFeeds.filter((feed) =>
    !feed.tags.some((tag) => db.tag.findFirst({ where: { id: { equals: tag.tagId }, type: { equals: 'folder' } } })));
  const rootSorting = folders.map((folder) => folder.sortid).join('').concat(uncategoriedFeeds.map(feed => feed.sortid).join(''));
  createFolderStreamPref(tagIdGenerator.buildIn('root'), rootSorting);
};

/**
 * 创建订阅源
 * @param tagIdGenerator 标签ID生成器
 */
const seedFeeds = (seeds: ({ title: string, url: string, htmlUrl: string, iconUrl: string })[]) => {
  if (db.feed.count() !== 0) return;
  const ARTICLE_NUM_PER_FEED = 10;

  seeds.forEach((feedSeed, feedIndex) => {
    // 创建订阅源
    const feedId = feedStreamIdGenerator(feedSeed.url);
    const feedEntry = db.feed.create({
      id: feedId,
      title: feedSeed.title,
      url: feedSeed.url,
      htmlUrl: feedSeed.htmlUrl,
      iconUrl: feedSeed.iconUrl,
      tags: [],
      articles: [],
      firstitemmsec: TIME, // 2天前
      sortid: makeSortIdGenerator('feed')(feedIndex),
    });

    // 创建文章
    const articles = []
    for (let j = 0; j < ARTICLE_NUM_PER_FEED; j++) {
      const articleId = `mock-item-${feedIndex * ARTICLE_NUM_PER_FEED + j}`;
      const article = createArticle(feedEntry, articleId, feedIndex, TIME);
      articles.push(article);
    }

    // 更新订阅源的文章列表
    db.feed.update({
      where: { id: { equals: feedEntry.id } },
      data: {
        articles: [...feedEntry.articles, ...articles],
      }
    });
  });
};


/**
 * 创建标签（系统标签和文件夹标签）
 * @param tagIdGenerator 标签ID生成器
 */
const seedFolders = (seeds: ({ title: string })[], tagIdGenerator: ReturnType<typeof makeStreamIdGenerator>) => {
  if (db.tag.count() !== 0) return;

  Object.values(SystemStreamIDs).forEach((tagId, index) => {
    db.tag.create({
      id: tagId,
      type: 'buildin',
      unread_count: 0,
      sortid: makeSortIdGenerator('buildIn')(index),
    });
  });

  seeds.forEach((folderSeed, index) => {
    db.tag.create({
      id: tagIdGenerator.folder(folderSeed.title),
      type: 'folder',
      unread_count: 0,
      sortid: makeSortIdGenerator('folder')(index)
    });
  });

  const MAX_COUNT_OF_FOLDER = 4;
  const feedEntries = db.feed.findMany({});
  const folders = db.tag.findMany({ where: { type: { equals: 'folder' } } });
  folders.forEach((folder, folderIndex) => {
    for (let feedIndex = 0; feedIndex < MAX_COUNT_OF_FOLDER; feedIndex++) {
      const feed = feedEntries[folderIndex * MAX_COUNT_OF_FOLDER + feedIndex];
      if (!feed) break;
      if (db.feedTag.count({ where: { feedId: { equals: feed.id }, tagId: { equals: folder.id } } }) > 0) continue;
      const feedTag = db.feedTag.create(joinBewteenFeedAndTag(feed.id, folder.id));
      db.feed.update({
        where: { id: { equals: feed.id } },
        data: {
          tags: [...feed.tags, feedTag],
        }
      });
      db.tag.update({
        where: { id: { equals: folder.id } },
        data: {
          feeds: [...folder.feeds, feedTag],
        }
      });
    }
  })
}


/**
 * 初始化所有种子数据
 */
export const seedDb = () => {
  const tagIdGenerator = makeStreamIdGenerator(USER_ID);
  seedUser(USER_ID);
  seedFeeds(feedSeeds);
  seedFolders(folderSeeds, tagIdGenerator);
  seedStreamPrefs(tagIdGenerator);
};
