import { db } from '../mock/db';
import { SystemStreamIDs } from "./stream.types";

// 检查文章是否具有特定标签
export const hasTag = (articleId: string, tagId: string) => {
  const article = db.article.findFirst({
    where: { id: { equals: articleId } }
  });
  
  if (!article) return false;
  
  const tag = db.tag.findFirst({
    where: { id: { equals: tagId } }
  });
  
  if (!tag) return false;
  
  // 检查文章是否关联了该标签
  const articleTags = article.tags || [];
  return articleTags.some(t => t.id === tagId);
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
  
  // 检查关系是否已存在
  if (!hasTag(articleId, tagId)) {
    // 建立文章和标签之间的关系
    db.article.update({
      where: { id: { equals: articleId } },
      data: {
        tags: [...(article.tags || []), tag]
      }
    });
    
    db.tag.update({
      where: { id: { equals: tagId } },
      data: {
        articles: [...(tag.articles || []), article]
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
  }
};
