import { factory, manyOf, primaryKey, oneOf, nullable } from '@mswjs/data'

// 创建数据模型
export const db = factory({
  // 用户模型
  user: {
    id: primaryKey(String),
    userName: String,
    userProfileId: String,
    userEmail: String,
    isBloggerUser: Boolean,
    signupTimeSec: Number,
    isMultiLoginEnabled: Boolean
  },

  // 文章模型
  article: {
    id: primaryKey(String),
    title: String,
    published: Number,
    content: String,
    author: String,
    timestampUsec: String,
    crawlTimeMsec: String,
    origin: nullable(oneOf('feed')),
    summary: Object,
    updated: Number,
    tags: manyOf('articleTag')
  },

  // 订阅源模型
  feed: {
    id: primaryKey(String),
    title: String,
    url: String,
    htmlUrl: String,
    iconUrl: String,
    firstitemmsec: Number,
    sortid: String,
    articles: manyOf('article'),
    tags: manyOf('feedTag')
  },

  // 标签模型
  tag: {
    id: primaryKey(String),
    type: String,
    unread_count: Number,
    sortid: String,
    articles: manyOf('articleTag'),
    feeds: manyOf('feedTag')
  },

  // 文章-标签关联表
  articleTag: {
    id: primaryKey(String),
    articleId: String,
    tagId: String,
  },

  // 订阅源-标签关联表
  feedTag: {
    id: primaryKey(String),
    feedId: String,
    tagId: String,
  },

  // streamPref 模型，用于存储订阅源和文件夹的排序信息
  streamPref: {
    id: primaryKey(String), // 对应某个标签或用户根目录的 ID,
    value: String // 存储标签或订阅源的排序信息
  }
})


