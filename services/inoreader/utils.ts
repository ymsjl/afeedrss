import { db } from '../mock/db';
import { joinBewteenArticleAndTag } from '../mock/utils';
import { SystemStreamIDs } from "./stream.types";

// 检查文章是否具有特定标签
export const hasTag = (articleId: string, tagId: string) => {
  return !!db.articleTag.count({
    where: { articleId: { equals: articleId }, tagId: { equals: tagId } }
  });
};

// 检查文章是否已读
export const isArticleRead = (articleId: string) => {
  return hasTag(articleId, SystemStreamIDs.READ);
};

// 检查文章是否已加星标
export const isArticleStarred = (articleId: string) => {
  return hasTag(articleId, SystemStreamIDs.STARRED);
};

// 为文章添加标签
export const addTagToArticle = (articleId: string, tagId: string) => {
  const article = db.article.findFirst({
    where: { id: { equals: articleId } }
  });

  if (!article) return;

  const tag = db.tag.findFirst({
    where: { id: { equals: tagId } }
  });

  if (!tag) return;

  const articleTag = db.articleTag.create(joinBewteenArticleAndTag(articleId, tagId));

  // 检查关系是否已存在
  if (!hasTag(articleId, tagId)) {
    db.article.update({
      where: { id: { equals: articleId } },
      data: {
        tags: [...(article.tags || []), articleTag]
      }
    });

    db.tag.update({
      where: { id: { equals: tagId } },
      data: {
        articles: [...(tag.articles || []), articleTag]
      }
    });
  }
};

// 从文章移除标签
export const removeTagFromArticle = (articleId: string, tagId: string) => {
  const article = db.article.findFirst({
    where: { id: { equals: articleId } }
  });

  if (!article) return;

  const tag = db.tag.findFirst({
    where: { id: { equals: tagId } }
  });

  if (!tag) return;

  // 移除文章和标签之间的关系
  if (hasTag(articleId, tagId)) {
    db.article.update({
      where: { id: { equals: articleId } },
      data: {
        tags: (article.tags || []).filter(t => t.id !== tagId)
      }
    });
    db.tag.update({
      where: { id: { equals: tagId } },
      data: {
        articles: (tag.articles || []).filter(a => a.id !== articleId)
      }
    });
    db.articleTag.delete({ where: { id: { equals: articleId }, tagId: { equals: tagId } } })
  }
};
