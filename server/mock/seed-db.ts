import { db } from './db';
import { SystemStreamIDs } from "../inoreader/stream.types";

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

const getImageBySeed = (seed: string | number) => `https://picsum.photos/seed/${seed}/600/400`;

const subscriptionSourceIconUrl = 'https://placehold.co/32x32';

/**
 * 生成真实新闻文章内容
 * @param index 文章索引，用于生成不同的内容
 * @returns 包含HTML格式的文章内容
 */
const generateArticleContent = (articleId: string): string => {
  const content = `
<h2>新研究显示全球变暖趋势有所减缓，但挑战仍然严峻</h2>
<figure><img src="${getImageBySeed(articleId)}" alt="环境保护相关图片" /><figcaption>环境保护示意图</figcaption></figure>
<p>最新的气候研究数据表明，得益于全球碳减排努力，全球变暖的速度在过去两年中已略有减缓。这一研究结果由国际气候科学联盟发布，基于对过去十年全球气温和海平面变化的全面分析。</p>
<p>研究表明，可再生能源的广泛应用是这一积极趋势的主要贡献者。"太阳能和风能发电的成本下降使这些清洁能源选择变得更加经济可行，"环境科学家李博士解释道。据统计，全球可再生能源装机容量在过去五年中增长了65%以上。</p>
<p>然而，科学家们警告说，当前的减排速度远远不足以实现《巴黎协定》设定的目标。"我们看到了希望的曙光，但这不是放松努力的理由，"研究的主要作者强调。"如果我们要避免气候变化的最严重影响，必须加倍努力。"</p>
<p>该报告还指出，发展中国家在转向绿色经济方面面临着特殊挑战，需要国际社会提供更多的技术和财政支持。多个国家已承诺增加气候融资，以帮助这些地区实现低碳转型。</p>
<p>随着本月底全球气候峰会的临近，这项研究将为政策制定者提供重要参考，推动更加雄心勃勃的减排承诺。</p>`;
  return content;
};

const makeTagIdGenerator = (userId: string) => {
  return {
    buildIn: (tagId: string) => `user/${userId}/state/com.google/${tagId}`,
    folder: (folderId: string) => `user/${userId}/label/${folderId}`,
  };
}

// 用户ID常量
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

/**
 * 创建标签（系统标签和文件夹标签）
 * @param tagIdGenerator 标签ID生成器
 */
const seedTags = (tagIdGenerator: ReturnType<typeof makeTagIdGenerator>) => {
  if (db.tag.count() !== 0) return;

  // 添加系统标签
  Object.values(SystemStreamIDs).forEach((tagId, index) => {
    db.tag.create({
      id: tagId,
      type: 'buildin',
      unread_count: 0,
      sortid: `s${index}`
    });
  });

  // 添加文件夹标签
  db.tag.create({
    id: tagIdGenerator.folder('科技新闻'),
    type: 'folder',
    unread_count: 5,
    sortid: 'f0000001'
  });

  db.tag.create({
    id: tagIdGenerator.folder('财经资讯'),
    type: 'folder',
    unread_count: 3,
    sortid: 'f0000002'
  });
};

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
const seedStreamPrefs = (tagIdGenerator: ReturnType<typeof makeTagIdGenerator>) => {
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
const seedFeeds = () => {
  if (db.feed.count() !== 0) return;
  const MAX_COUNT_OF_FOLDER = 4;
  const ARTICLE_NUM_PER_FOLDER = 10;

  let folderIndex = 0
  const folders = db.tag.findMany({ where: { type: { equals: 'folder' } } });
  feedSeeds.forEach((feedSeed, index) => {
    const currentFolderIndex = Math.floor(index / MAX_COUNT_OF_FOLDER);
    if (currentFolderIndex > folderIndex) {
      folderIndex = currentFolderIndex
    }

    const folder = folders[folderIndex]
    const articles = []
    for (let j = 0; j < ARTICLE_NUM_PER_FOLDER; j++) {
      const articleId = `mock-item-${index * ARTICLE_NUM_PER_FOLDER + j}`;
      const article = createArticle(null, articleId, index, TIME);
      articles.push(article);
    }
    const feedId = 'mock-feed-' + index;

    const feedEntry = db.feed.create({
      id: feedId,
      title: feedSeed.title,
      url: feedSeed.url,
      htmlUrl: feedSeed.htmlUrl,
      iconUrl: feedSeed.iconUrl,
      tags: [],
      articles: articles,
      firstitemmsec: TIME, // 2天前
      sortid: `a${index.toString().padStart(7, '0')}`,
    });

    if (folder) {
      const feedTag = db.feedTag.create({
        id: `${feedId}:${folder.id}`,
        tagId: folder.id,
        feedId: feedEntry.id
      });
      const folderFeedTags = db.tag.findFirst({ where: { id: { equals: folder?.id } } })?.feeds ?? [];

      db.feed.update({
        where: { id: { equals: feedEntry.id } },
        data: {
          tags: [...feedEntry.tags, feedTag],
        }
      });

      db.tag.update({
        where: { id: { equals: folder.id } },
        data: {
          feeds: [...folderFeedTags, feedTag],
        }
      });
    }

    articles.forEach((article) => {
      db.article.update({
        where: { id: { equals: article.id } },
        data: { origin: feedEntry }
      });
    });
  });
};

/**
 * 初始化所有种子数据
 */
export const seedDb = () => {
  const tagIdGenerator = makeTagIdGenerator(USER_ID);
  seedUser(USER_ID);
  seedTags(tagIdGenerator);
  seedFeeds();
  seedStreamPrefs(tagIdGenerator);
};
