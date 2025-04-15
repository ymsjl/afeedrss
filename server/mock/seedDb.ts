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

// 随机图片 URL 列表
const imageUrls = [
  'https://picsum.photos/800/450?random=1',
  'https://picsum.photos/800/450?random=2',
  'https://picsum.photos/800/450?random=3',
  'https://picsum.photos/800/450?random=4',
  'https://picsum.photos/800/450?random=5',
];

/**
 * 生成真实新闻文章内容
 * @param index 文章索引，用于生成不同的内容
 * @returns 包含HTML格式的文章内容
 */
const generateArticleContent = (index: number): string => {
  // 随机选择一个主题
  const topic = articleTopics[index % articleTopics.length];
  // 随机选择图片
  const imageUrl = imageUrls[index % imageUrls.length];
  // 随机确定段落数量 (3-5)
  const paragraphCount = 3 + Math.floor(Math.random() * 3);
  
  // 根据主题生成不同的标题和内容
  let headline = '';
  let paragraphs: string[] = [];
  
  switch (topic) {
    case '科技创新':
      headline = `人工智能技术在${2024 + (index % 3)}年取得重大突破`;
      paragraphs = [
        `据行业专家报道，人工智能领域在今年第${(index % 4) + 1}季度取得了革命性的进展。研究人员开发出了一种新的深度学习算法，能够以前所未有的精确度预测复杂系统的行为。这一突破可能对医疗诊断、气候模型和自动驾驶技术产生深远影响。`,
        `"这项技术将改变我们解决复杂问题的方式，"首席研究员张教授解释道。"我们现在能够处理的数据量比以前增加了十倍，同时计算效率提高了近30%。"这一进展引起了科技行业的广泛关注，多家顶级科技公司已表示有意将这项技术整合到其现有产品中。`,
        `然而，专家们也警告说，随着AI技术的快速发展，我们需要更加关注伦理和隐私问题。"创新必须与负责任的实施并行，"技术伦理专家王博士表示。政府部门已开始讨论相关监管框架，以确保这些强大的新工具被用于造福社会。`,
        `业内人士预计，这项技术的商业应用可能在未来12-18个月内开始大规模推广，为各行各业带来显著的效率提升和成本节约。`
      ];
      break;
    case '环境保护':
      headline = `新研究显示全球变暖趋势有所减缓，但挑战仍然严峻`;
      paragraphs = [
        `最新的气候研究数据表明，得益于全球碳减排努力，全球变暖的速度在过去两年中已略有减缓。这一研究结果由国际气候科学联盟发布，基于对过去十年全球气温和海平面变化的全面分析。`,
        `研究表明，可再生能源的广泛应用是这一积极趋势的主要贡献者。"太阳能和风能发电的成本下降使这些清洁能源选择变得更加经济可行，"环境科学家李博士解释道。据统计，全球可再生能源装机容量在过去五年中增长了65%以上。`,
        `然而，科学家们警告说，当前的减排速度远远不足以实现《巴黎协定》设定的目标。"我们看到了希望的曙光，但这不是放松努力的理由，"研究的主要作者强调。"如果我们要避免气候变化的最严重影响，必须加倍努力。"`,
        `该报告还指出，发展中国家在转向绿色经济方面面临着特殊挑战，需要国际社会提供更多的技术和财政支持。多个国家已承诺增加气候融资，以帮助这些地区实现低碳转型。`,
        `随着本月底全球气候峰会的临近，这项研究将为政策制定者提供重要参考，推动更加雄心勃勃的减排承诺。`
      ];
      break;
    default:
      headline = `${topic}领域新发展引发广泛关注与讨论`;
      paragraphs = [
        `近日，在${topic}领域出现了值得关注的新趋势。专家们指出，这些发展可能对行业未来产生深远影响。根据最新发布的研究报告，相关指标显示出积极的变化趋势，引发了业内人士的广泛讨论。`,
        `"我们正在见证一个转折点，"行业权威专家表示。"这些变化不仅体现了技术进步，也反映了公众需求和社会价值观的演变。"多项数据分析表明，这一趋势在过去几个季度中持续加强，并有望在未来一年内保持增长势头。`,
        `然而，也有分析人士持谨慎态度。"虽然进展令人鼓舞，但我们仍然面临一些结构性挑战，"某研究机构的报告指出。这些挑战包括基础设施不足、资金限制以及政策环境的不确定性。`,
        `各方利益相关者正在积极寻找解决方案。政府部门已宣布将出台新的支持政策，企业界也在加大技术创新和商业模式转型的投入。专家预测，随着这些努力的深入，行业将迎来新一轮的快速发展。`
      ];
  }
  
  // 随机决定图片位置（开头、中间或结尾）
  const imagePosition = Math.floor(Math.random() * 3);
  
  // 构建HTML内容
  let htmlContent = `<h2>${headline}</h2>\n`;
  
  // 根据图片位置插入图片和段落
  if (imagePosition === 0) {
    // 图片在开头
    htmlContent += `<figure><img src="${imageUrl}" alt="${topic}相关图片" /><figcaption>${topic}示意图</figcaption></figure>\n`;
    paragraphs.forEach(paragraph => {
      htmlContent += `<p>${paragraph}</p>\n`;
    });
  } else if (imagePosition === 1) {
    // 图片在中间
    const middleIndex = Math.floor(paragraphs.length / 2);
    
    for (let i = 0; i < paragraphs.length; i++) {
      htmlContent += `<p>${paragraphs[i]}</p>\n`;
      if (i === middleIndex) {
        htmlContent += `<figure><img src="${imageUrl}" alt="${topic}相关图片" /><figcaption>${topic}示意图</figcaption></figure>\n`;
      }
    }
  } else {
    // 图片在结尾
    paragraphs.forEach(paragraph => {
      htmlContent += `<p>${paragraph}</p>\n`;
    });
    htmlContent += `<figure><img src="${imageUrl}" alt="${topic}相关图片" /><figcaption>${topic}示意图</figcaption></figure>\n`;
  }
  
  return htmlContent;
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
      unreadCount: 0,
      sortid: `s${index}`
    });
  });

  // 添加文件夹标签
  db.tag.create({
    id: tagIdGenerator.folder('folder1'),
    type: 'folder',
    label: 'Folder 1',
    unreadCount: 5,
    sortid: 'f0000001'
  });

  db.tag.create({
    id: tagIdGenerator.folder('folder2'),
    type: 'folder',
    label: 'Folder 2',
    unreadCount: 3,
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
    iconUrl: 'https://mock-feed-1.com/favicon.ico',
    tags: folder1 ? [folder1] : [],
    firstitemmsec: Date.now() - (24 * 60 * 60 * 1000), // 1天前
    sortid: 'a0000001'  // 使用a开头表示feed，方便与文件夹区分
  });

  db.feed.create({
    id: 'feed/mock-feed-2',
    title: 'Mock Feed 2',
    url: 'https://mock-feed-2.com/feed',
    htmlUrl: 'https://mock-feed-2.com',
    iconUrl: 'https://mock-feed-2.com/favicon.ico',
    tags: folder2 ? [folder2] : [],
    firstitemmsec: Date.now() - (2 * 24 * 60 * 60 * 1000), // 2天前
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
    const timestamp = Date.now() - (i * 86400000);

    for (let j = 0; j < ARTICLE_NUM_PER_FOLDER; j++) {
      const articleId = `mock-item-${i * ARTICLE_NUM_PER_FOLDER + j}`;
      createArticle(feed, articleId, i, timestamp);
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
