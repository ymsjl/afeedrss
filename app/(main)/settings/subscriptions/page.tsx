"use client";

import React, { Suspense, useState } from "react";
import { Button } from "@fluentui/react-components";
import { Add20Regular } from "@fluentui/react-icons";
import { SettingsPageLayout } from "@/components/settings-page-layout";
import { SubscriptionSkeleton } from "./_components/SubscriptionSkeleton";
import { TabsWithData } from "./_components/TabWithData";

interface Props { }

export default function SubscriptionSource({ }: Props) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

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
      <Suspense fallback={<SubscriptionSkeleton />}>
        <TabsWithData isDialogOpen={isDialogOpen} setIsDialogOpen={setIsDialogOpen} />
      </Suspense>
    </SettingsPageLayout >
  );
}
