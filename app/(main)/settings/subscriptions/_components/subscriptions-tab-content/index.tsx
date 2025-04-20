import React from "react";
import { Image, List, ListItem, mergeClasses, Text } from "@fluentui/react-components";
import { Folder20Regular } from "@fluentui/react-icons";

import { useListClasses } from "@/app/(main)/_components/stream-content-panel/steam-content-list-item";
import { Subscription } from "@/server/inoreader/subscription.types";
import { useCommonClasses, useFlexClasses } from "@/theme/commonStyles";
import { useClasses } from "../../useClasses";

export const SubscriptionsTabContent = React.memo(({ subscriptions }: { subscriptions: Subscription[] }) => {
  const classes = useClasses();
  const commonClasses = useCommonClasses();
  const flexClasses = useFlexClasses();
  const listClasses = useListClasses()

  return (
    <List className={listClasses.list}>
      {subscriptions.map(subscription => {
        return (
          <ListItem key={subscription.id} className={listClasses.listItem} >
            <div className={mergeClasses(flexClasses.flexRow, flexClasses.itemsCenter, classes.feedItemContainer)}>
              <div className={mergeClasses(flexClasses.flexGrow, commonClasses.spaceY2)}>
                <div className={mergeClasses(flexClasses.flexRow, flexClasses.itemsCenter, commonClasses.spaceX2)}>
                  <Image className={mergeClasses(flexClasses.flexDisableShrink, classes.icon)} src={subscription.iconUrl} alt={subscription.title} width={16} height={16} />
                  <Text size={300}>{subscription.title}</Text>
                </div>
                {(subscription.categories.length > 0) && <div className={commonClasses.spaceX8}>
                  {
                    subscription.categories.map(category => (
                      <div key={category.id} className={mergeClasses(flexClasses.flexRow, flexClasses.itemsCenter, commonClasses.spaceX1)}>
                        <Folder20Regular />
                        <Text size={200}>{category?.label}</Text>
                      </div>
                    ))
                  }
                </div>}
              </div>
            </div>
          </ListItem>
        )
      })}
    </List>
  )
})
