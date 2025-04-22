import { db } from './db';
import { SystemStreamIDs } from "../inoreader/stream.types";

// 初始化种子数据

// 文章主题列表，用于生成随机内容
const articleTopics = [
  '科技创新',
  '环境保护',
  '健康生活',
  '经济发展',
  '教育改革',
  '文化艺术',
  '体育赛事',
  '旅游探索'
];

const TIME = 1745308167740

const articleImageUrl = 'https://placehold.co/600x400';

const subscriptionSourceIconUrl = 'https://placehold.co/32x32';


/**
 * 生成真实新闻文章内容
 * @param index 文章索引，用于生成不同的内容
 * @returns 包含HTML格式的文章内容
 */
const generateArticleContent = (index: number): string => {
  const content = `
<h2>新研究显示全球变暖趋势有所减缓，但挑战仍然严峻</h2>
<figure><img src="${articleImageUrl}" alt="环境保护相关图片" /><figcaption>环境保护示意图</figcaption></figure>
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
      label: tagId.split('/').pop() || '',
      unread_count: 0,
      sortid: `s${index}`
    });
  });

  // 添加文件夹标签
  db.tag.create({
    id: tagIdGenerator.folder('folder1'),
    type: 'folder',
    label: 'Folder 1',
    unread_count: 5,
    sortid: 'f0000001'
  });

  db.tag.create({
    id: tagIdGenerator.folder('folder2'),
    type: 'folder',
    label: 'Folder 2',
    unread_count: 3,
    sortid: 'f0000002'
  });
};

/**
 * 创建订阅源
 * @param tagIdGenerator 标签ID生成器
 */
const seedFeeds = (tagIdGenerator: ReturnType<typeof makeTagIdGenerator>) => {
  if (db.feed.count() !== 0) return;

  const folder1 = db.tag.findFirst({
    where: { id: { equals: tagIdGenerator.folder('folder1') } }
  });

  const folder2 = db.tag.findFirst({
    where: { id: { equals: tagIdGenerator.folder('folder2') } }
  });

  // 创建订阅源并与文件夹标签建立关联
  db.feed.create({
    id: 'feed/mock-feed-1',
    title: 'Mock Feed 1',
    url: 'https://mock-feed-1.com/feed',
    htmlUrl: 'https://mock-feed-1.com',
    iconUrl: subscriptionSourceIconUrl,
    tags: folder1 ? [folder1] : [],
    firstitemmsec: TIME, // 1天前
    sortid: 'a0000001'  // 使用a开头表示feed，方便与文件夹区分
  });

  db.feed.create({
    id: 'feed/mock-feed-2',
    title: 'Mock Feed 2',
    url: 'https://mock-feed-2.com/feed',
    htmlUrl: 'https://mock-feed-2.com',
    iconUrl: subscriptionSourceIconUrl,
    tags: folder2 ? [folder2] : [],
    firstitemmsec: TIME, // 2天前
    sortid: 'a0000002'
  });
};

/**
 * 创建模拟文章
 */
const seedArticles = () => {
  if (db.article.count() !== 0) return
  const feeds = db.feed.getAll();
  const ARTICLE_NUM_PER_FOLDER = 10;

  feeds.forEach((feed, i) => {
    for (let j = 0; j < ARTICLE_NUM_PER_FOLDER; j++) {
      const articleId = `mock-item-${i * ARTICLE_NUM_PER_FOLDER + j}`;
      createArticle(feed, articleId, i, TIME);
    }
  });
};

/**
 * 创建单个文章
 */
const createArticle = (feed: any, articleId: string, index: number, timestamp: number) => {
  db.article.create({
    id: articleId,
    title: `Mock Article ${index}`,
    published: timestamp,
    feed: feed,
    feedTitle: feed.title, // 修正了feedTitle使用动态值
    author: 'Another Author',
    timestampUsec: (timestamp * 1000).toString(),
    crawlTimeMsec: (timestamp * 1000 + 3600000).toString(),
    origin: {
      htmlUrl: feed.htmlUrl,
      streamId: feed.id,
      title: feed.title
    },
    summary: {
      direction: 'ltr',
      content: generateArticleContent(index)
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
  if (db.streamPref.count() === 0) {
    // 根目录的排序
    const rootId = tagIdGenerator.buildIn('root');
    db.streamPref.create({
      id: rootId,
      value: JSON.stringify([
        { id: 'subscription-ordering', value: 'f0000001f0000002' } // 把两个文件夹按顺序放在根目录
      ])
    });

    // 文件夹的排序
    createFolderStreamPref(tagIdGenerator, 'folder1', 'a0000001');
    createFolderStreamPref(tagIdGenerator, 'folder2', 'a0000002');
  }
};

/**
 * 创建文件夹的排序数据
 */
const createFolderStreamPref = (
  tagIdGenerator: ReturnType<typeof makeTagIdGenerator>,
  folderId: string,
  sortValue: string
) => {
  db.streamPref.create({
    id: tagIdGenerator.folder(folderId),
    value: JSON.stringify([
      { id: 'subscription-ordering', value: sortValue }
    ])
  });
};

/**
 * 初始化所有种子数据
 */
export const seedDb = () => {
  const tagIdGenerator = makeTagIdGenerator(USER_ID);

  // 按顺序添加各类数据
  seedUser(USER_ID);
  seedTags(tagIdGenerator);
  seedFeeds(tagIdGenerator);
  seedArticles();
  seedStreamPrefs(tagIdGenerator);
};
