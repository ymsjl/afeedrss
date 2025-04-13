'use client'
import React from "react";
import StatusCard, { Status } from "@components/StatusCard";
import {
  Breadcrumb,
  BreadcrumbButton,
  BreadcrumbDivider,
  BreadcrumbItem,
  makeStyles,
  mergeClasses,
  shorthands,
  tokens,
} from "@fluentui/react-components";
import { useClasses as useHomePageClasses } from '@/app/(main)/page'
import { useFlexClasses, useTextClasses } from "@/theme/commonStyles";

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
  const textClasses = useTextClasses();
  const flexClasses = useFlexClasses();
  const homePageClasses = useHomePageClasses();

  return (
    <div className={homePageClasses.main}>
      <div className={homePageClasses.content}>
        <div className={mergeClasses(homePageClasses.header, flexClasses.justifyBetween)}>
          <div className={flexClasses.flexGrow}>
            <Breadcrumb size="large">
              <BreadcrumbItem>
                <BreadcrumbButton href="/settings" className={textClasses.textLg}>设置</BreadcrumbButton>
              </BreadcrumbItem>
              {breadcrumbItems?.map((item) => (
                <React.Fragment key={item.key}>
                  <BreadcrumbDivider />
                  <BreadcrumbItem key={item.key}>
                    <BreadcrumbButton href={item.href} className={textClasses.textLg}>
                      {item.title}
                    </BreadcrumbButton>
                  </BreadcrumbItem>
                </React.Fragment>
              ))}
            </Breadcrumb>
          </div>
          <div className={flexClasses.flexDisableShrink}>{tailElem}</div>
        </div>
        <div className={flexClasses.flexGrow}>
          {children ?? (
            <StatusCard status={Status.EMPTY} content="这里空无一物" />
          )}
        </div>
      </div>
    </div>
  );
}
