'use client'

import React from "react";
import { StatusCard, Status } from "@/components/status-card";
import {
  Breadcrumb,
  BreadcrumbButton,
  BreadcrumbDivider,
  BreadcrumbItem,
  mergeClasses,
} from "@fluentui/react-components";
import { useCommonClasses, useFlexClasses } from "@/theme/commonStyles";
import { useSharedPageLayoutClasses } from '@/styles/shared-page-layout.styles';

interface Props {
  title?: string;
  children?: React.ReactNode;
  tailElem?: React.ReactNode;
  breadcrumbItems?: { title: string; key: string; href?: string }[];
}

export function SettingsPageLayout({
  children,
  breadcrumbItems,
  tailElem,
}: Props) {
  const flexClasses = useFlexClasses();
  const commonClasses = useCommonClasses();
  const sharedPageLayoutClasses = useSharedPageLayoutClasses();

  return (
    <div className={mergeClasses(sharedPageLayoutClasses.mainLayout, sharedPageLayoutClasses.mainSurface)}>
      <div className={mergeClasses(sharedPageLayoutClasses.content, sharedPageLayoutClasses.fullHeightColumnLayout, flexClasses.headerBodyColumn)}>
        <div className={mergeClasses(sharedPageLayoutClasses.pageTitle, flexClasses.flexRow, flexClasses.justifyBetween)}>
          <div className={flexClasses.flexGrow}>
            <Breadcrumb size="large">
              <BreadcrumbItem>
                <BreadcrumbButton href="/settings">设置</BreadcrumbButton>
              </BreadcrumbItem>
              {breadcrumbItems?.map((item) => (
                <React.Fragment key={item.key}>
                  <BreadcrumbDivider />
                  <BreadcrumbItem key={item.key}>
                    <BreadcrumbButton href={item.href} >
                      {item.title}
                    </BreadcrumbButton>
                  </BreadcrumbItem>
                </React.Fragment>
              ))}
            </Breadcrumb>
          </div>
          <div className={flexClasses.flexDisableShrink}>{tailElem}</div>
        </div>
        <div className={mergeClasses(commonClasses.overflowHidden)}>
          {children ?? (
            <StatusCard status={Status.EMPTY} content="这里空无一物" />
          )}
        </div>
      </div>
    </div>
  );
}
