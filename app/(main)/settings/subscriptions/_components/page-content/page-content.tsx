"use client";

import React from "react";
import { useQuery, useSuspenseQuery } from "@tanstack/react-query";
import { denormalize } from "normalizr";
import { subscriptionsQueryOptions, folderQueryOptions } from "@/services/subscription/subscription.rquery";
import { folderSchema, subscriptionSchema } from "@/services/subscription/subscription.entity";
import { Folder, Subscription } from "@/services/subscription";
import { TabContextProvider, TabPanel, TabPanels } from '@/components/tab-panes'
import { useClasses } from "../../useClasses";
import { SubscriptionsTabContent } from "../subscriptions-tab-content";
import { FoldersTabContent } from "../folders-tab-content";
import { AddSubscriptionDialog } from "../add-subscription-dialog";
import { TAB_KEYS } from "../../constants";
import { useCommonClasses } from "@/theme/commonStyles";
import { mergeClasses } from "@fluentui/react-components";

export function SubscriptionPageContent({ isDialogOpen, setIsDialogOpen, selectedTab }: { isDialogOpen: boolean, setIsDialogOpen: (open: boolean) => void, selectedTab: string }) {
  const classes = useClasses();
  const commonClasses = useCommonClasses();

  const subscriptionsQuery = useSuspenseQuery(subscriptionsQueryOptions);
  const folderQuery = useQuery(folderQueryOptions);

  const subscriptionsData = subscriptionsQuery.data;
  const folderData = folderQuery.data;

  const subscriptions: Subscription[] = denormalize(subscriptionsData.result, [subscriptionSchema], subscriptionsData.entities) ?? [];
  const folders: Folder[] = denormalize(folderData?.result, [folderSchema], folderData?.entities) ?? [];

  return (
    <>
      <TabContextProvider activedValue={selectedTab}>
        <TabPanels className={mergeClasses(commonClasses.fillFullHeight, classes.tabContent)}>
          <TabPanel value={TAB_KEYS.SUBSCRIPTIONS} className={mergeClasses(classes.tabContent, commonClasses.noScrollbar)}>
            <SubscriptionsTabContent subscriptions={subscriptions} />
          </TabPanel>
          <TabPanel value={TAB_KEYS.FOLDER} className={mergeClasses(classes.tabContent, commonClasses.noScrollbar)}>
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
