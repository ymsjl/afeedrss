"use client";

import React, { Suspense, useState } from "react";
import { Button, mergeClasses, SelectTabData, SelectTabEvent } from "@fluentui/react-components";
import { Add20Regular } from "@fluentui/react-icons";
import { SettingsPageLayout } from "@/app/(main)/settings/_components/settings-page-layout";
import { SubscriptionPageContent, SubscriptionPageContentSkeleton } from "./_components/page-content";
import { useClasses } from "./useClasses";
import { TAB_KEYS } from "./constants";
import { SubscriptionTabList } from "./_components/subscription-tab-list";
import { useCommonClasses } from "@/theme/commonStyles";

interface Props { }

export default function SubscriptionSource({ }: Props) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const classes = useClasses();
  const commonClasses = useCommonClasses();
  const [selectedTab, setSelectedTab] = useState(TAB_KEYS.SUBSCRIPTIONS)

  const onTabSelect = (event: SelectTabEvent, data: SelectTabData) => {
    setSelectedTab(String(data.value));
  };

  return (
    <SettingsPageLayout
      title="订阅源"
      breadcrumbItems={[
        {
          title: "订阅源",
          key: "subscription_source",
          href: "/settings/subscriptions",
        },
      ]}
      tailElem={
        <Button icon={<Add20Regular />} onClick={() => setIsDialogOpen(true)}>
          添加订阅源
        </Button>
      }
    >
      <div className={mergeClasses(commonClasses.fillFullHeight, commonClasses.py1, classes.root)}>
        <SubscriptionTabList className={mergeClasses(commonClasses.mx1)} selectedValue={selectedTab} onTabSelect={onTabSelect} />
        <Suspense fallback={<SubscriptionPageContentSkeleton />}>
          <SubscriptionPageContent isDialogOpen={isDialogOpen} setIsDialogOpen={setIsDialogOpen} selectedTab={selectedTab} />
        </Suspense>
      </div>
    </SettingsPageLayout >
  );
}
