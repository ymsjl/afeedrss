import React from "react";
import { Button, Image, mergeClasses, Text } from "@fluentui/react-components";
import { Folder20Regular, Delete20Filled, Delete20Regular, bundleIcon } from "@fluentui/react-icons";

import { useListClasses } from "@/app/(main)/_components/stream-content-panel/stream-content-list-item.style"
import { Subscription, api as subscriptionApi } from "@/services/subscription";
import { useCommonClasses, useFlexClasses } from "@/theme/commonStyles";
import { useClasses as useSubscriptionPageClasses } from "../../useClasses";
import { useClasses } from "./subscriptions-tab-content.style";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/services/constants";

const DeleteIcon = bundleIcon(Delete20Filled, Delete20Regular)

export const SubscriptionsTabContent = React.memo(({ subscriptions }: { subscriptions: Subscription[] }) => {
  const subscriptionPageClasses = useSubscriptionPageClasses();
  const classes = useClasses();
  const commonClasses = useCommonClasses();
  const flexClasses = useFlexClasses();
  const listClasses = useListClasses()
  const queryClient = useQueryClient();

  const unsubscriptionMutation = useMutation({
    mutationFn: subscriptionApi.unsubscription,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.SUBSCRIPTIONS_LIST] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.STREAM_PREFERENCES] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.FOLDER] });
    },
  })

  return (
    <ul className={listClasses.list}>
      {subscriptions.map(subscription => {
        return (
          <li key={subscription.id} className={listClasses.listItem} >
            <div className={mergeClasses(flexClasses.flexRow, flexClasses.itemsCenter, subscriptionPageClasses.feedItemContainer)}>
              <div className={mergeClasses(flexClasses.flexGrow, commonClasses.spaceY2)}>
                <div className={mergeClasses(flexClasses.flexRow, flexClasses.itemsCenter, commonClasses.spaceX2)}>
                  <Image className={mergeClasses(flexClasses.flexDisableShrink, subscriptionPageClasses.icon)} src={subscription.iconUrl} alt={subscription.title} width={16} height={16} />
                  <Text size={300}>{subscription.title}</Text>
                  <div className={flexClasses.flexGrow}></div>
                  <Button appearance="transparent" icon={<DeleteIcon />} onClick={() => unsubscriptionMutation.mutate(subscription.id)} />
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
          </li>
        )
      })}
    </ul>
  )
})
