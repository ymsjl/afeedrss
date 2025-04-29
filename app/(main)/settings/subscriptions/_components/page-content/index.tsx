"use client";

import React, { useState } from "react";
import { SelectTabEvent, SelectTabData } from "@fluentui/react-components";
import { useQuery, useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { denormalize } from "normalizr";
import { subscriptionsQueryOptions, folderQueryOptions } from "@/services/subscription/subscription.rquery";
import { folderSchema, subscriptionSchema } from "@/services/subscription/subscription.entity";
import { Folder, Subscription } from "@/services/subscription";
import { TabContextProvider, TabPanel, TabPanels } from '@/components/tab-panes'
import { useClasses } from "../../useClasses";
import { SubscriptionTabList } from "../subscription-tab-list";
import { SubscriptionsTabContent } from "../subscriptions-tab-content";
import { FoldersTabContent } from "../folders-tab-content";
import { AddSubscriptionDialog } from "../add-subscription-dialog";
import { TAB_KEYS } from "../../constants";

export function SubscriptionPageContent({ isDialogOpen, setIsDialogOpen }: { isDialogOpen: boolean, setIsDialogOpen: (open: boolean) => void }) {
  const classes = useClasses();

  const subscriptionsQuery = useSuspenseQuery(subscriptionsQueryOptions);
  const folderQuery = useQuery(folderQueryOptions);
  const [selectedTab, setSelectedTab] = useState(TAB_KEYS.SUBSCRIPTIONS)

  const subscriptionsData = subscriptionsQuery.data;
  const folderData = folderQuery.data;


  const onTabSelect = (event: SelectTabEvent, data: SelectTabData) => {
    setSelectedTab(String(data.value));
  };

  const subscriptions: Subscription[] = denormalize(subscriptionsData.result, [subscriptionSchema], subscriptionsData.entities) ?? [];
  const folders: Folder[] = denormalize(folderData?.result, [folderSchema], folderData?.entities) ?? [];

  return (
    <>
      <SubscriptionTabList selectedValue={selectedTab} onTabSelect={onTabSelect} />
      <TabContextProvider activedValue={selectedTab}>
        <TabPanels className={classes.tabContent}>
          <TabPanel value={TAB_KEYS.SUBSCRIPTIONS}>
            <SubscriptionsTabContent subscriptions={subscriptions} />
          </TabPanel>
          <TabPanel value={TAB_KEYS.FOLDER}>
            <FoldersTabContent folders={folders} />
          </TabPanel>
        </TabPanels>
      </TabContextProvider>
      <AddSubscriptionDialog
        open={isDialogOpen}
        onOpenChange={(_, { open }) => setIsDialogOpen(open)}
        onClose={() => setIsDialogOpen(false)}
        folders={folders}
      />
    </>
  )
}
