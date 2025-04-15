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
    feed: oneOf('feed'), // 改为直接引用 feed 对象，而不是 feedId
    feedTitle: String,
    author: String,
    timestampUsec: String,
    crawlTimeMsec: String,
    origin: Object,
    summary: Object,
    updated: Number,
    tags: manyOf('tag'), // 多对多关系：一篇文章可以有多个标签
  },

  // 订阅源模型
  feed: {
    id: primaryKey(String),
    title: String,
    url: String,
    htmlUrl: String,
    iconUrl: String,
    tags: manyOf('tag'), // 多对多关系：一个订阅源可以属于多个标签(文件夹)
    firstitemmsec: Number,
    sortid: String, // 添加 sortid 字段用于导航树排序
    articles: manyOf('article') // 一对多关系：一个订阅源有多篇文章
  },

  // 标签模型
  tag: {
    id: primaryKey(String),
    type: String, // "tag", "folder", "active_search" 或系统标签
    label: String,
    unreadCount: Number,
    sortid: String,
    articles: manyOf('article'), // 多对多关系：一个标签可以应用于多篇文章
    feeds: manyOf('feed'), // 多对多关系：一个标签(文件夹)可以包含多个订阅源
  },

  // streamPref 模型，用于存储订阅源和文件夹的排序信息
  streamPref: {
    id: primaryKey(String), // 对应某个标签或用户根目录的 ID,
    value: String, // 存储标签或订阅源的排序信息
  }
})


