import { NormalizedSchema, schema } from "normalizr";
import { FeedProps } from ".";

export interface InfiniteNormalizedArticles
  extends NormalizedSchema<ArticleEntitySchema, string[]> {
  continuation: string;
}

export interface ArticleEntitySchema {
  article: {
    [key: string]: any;
  };
}

export const article = new schema.Entity<FeedProps>("article");


export const subscriptionSchema = new schema.Entity("subscription", undefined);

export const folderSchema = new schema.Entity("folder");
