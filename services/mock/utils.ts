const makeJoin = (leftIdName: string, rightIdName: string) => (leftId: string, rightId: string) => ({
  id: `${leftId}:${rightId}`,
  [leftIdName]: leftId,
  [rightIdName]: rightId
});

export const joinBewteenFeedAndTag = makeJoin('feedId', 'tagId');

export const joinBewteenArticleAndTag = makeJoin('articleId', 'tagId'); export const makeSortIdGenerator = (type: string) => (id: number) => {
  const prefix = ({ 'buildIn': 's', 'folder': 'f', 'feed': 'a' })[type] ?? 'u';
  return `${prefix}${id.toString().padStart(7, '0')}`;
};
export const makeStreamIdGenerator = (userId: string) => {
  return {
    buildIn: (tagId: string) => `user/${userId}/state/com.google/${tagId}`,
    folder: (folderName: string) => `user/${userId}/label/${folderName}`,
  };
};
export const feedStreamIdGenerator = (feedUrl: string) => `feed/${feedUrl}`;

export const getPlaceholderImage = (seed: string | number, { w = 600, h = 400 }: { w: number, h: number } = { w: 600, h: 600 }) => {
  return `https://picsum.photos/seed/${seed}/${w}/${h}`;
}

/*
 * 生成真实新闻文章内容
 * @param index 文章索引，用于生成不同的内容
 * @returns 包含HTML格式的文章内容
 */
export const generateArticleContent = (articleId: string): string => {
  const content = `
<h2>新研究显示全球变暖趋势有所减缓，但挑战仍然严峻</h2>
<figure><img src="${getPlaceholderImage(articleId)}" alt="环境保护相关图片" /><figcaption>环境保护示意图</figcaption></figure>
<p>最新的气候研究数据表明，得益于全球碳减排努力，全球变暖的速度在过去两年中已略有减缓。这一研究结果由国际气候科学联盟发布，基于对过去十年全球气温和海平面变化的全面分析。</p>
<p>研究表明，可再生能源的广泛应用是这一积极趋势的主要贡献者。"太阳能和风能发电的成本下降使这些清洁能源选择变得更加经济可行，"环境科学家李博士解释道。据统计，全球可再生能源装机容量在过去五年中增长了65%以上。</p>
<p>然而，科学家们警告说，当前的减排速度远远不足以实现《巴黎协定》设定的目标。"我们看到了希望的曙光，但这不是放松努力的理由，"研究的主要作者强调。"如果我们要避免气候变化的最严重影响，必须加倍努力。"</p>
<p>该报告还指出，发展中国家在转向绿色经济方面面临着特殊挑战，需要国际社会提供更多的技术和财政支持。多个国家已承诺增加气候融资，以帮助这些地区实现低碳转型。</p>
<p>随着本月底全球气候峰会的临近，这项研究将为政策制定者提供重要参考，推动更加雄心勃勃的减排承诺。</p>`;
  return content;
};

