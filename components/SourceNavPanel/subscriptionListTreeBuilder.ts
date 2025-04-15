import { IdValuePair } from "../../server/inoreader/stream.types";
import { KeyValuePair } from "../../types";
import { Folder } from "@/server/inoreader/subscription.types";
import { Subscription } from "@/server/inoreader/subscription.types";
import { SubscriptionNavTreeBuilder } from "./subscriptionNavTreeBuilder";
import { getRootStreamId } from "../StreamContentPanel/getStreamContentQueryKey";

export default class SubscriptionGroupedListBuilder extends SubscriptionNavTreeBuilder {
  constructor({
    userId,
    subscriptionById,
    tagsById,
    streamPrefById,
  }: {
    userId: string;
    subscriptionById: KeyValuePair<Subscription>;
    tagsById: KeyValuePair<Folder>;
    streamPrefById: KeyValuePair<IdValuePair[]>;
  }) {
    super({
      rootStreamId: getRootStreamId(userId),
      subscriptionById,
      tagsById,
      streamPrefById,
    });
  }

  buildGroupedList() {
    const items = [];
    const groups = [];

    return {
      items,
      groups,
    };
  }
}
