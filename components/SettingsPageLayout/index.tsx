'use client'
import React, { useContext } from "react";
import StatusCard, { Status } from "@components/StatusCard";
import { GlobalNavigationCtx } from "@components/HomePageLayout/GlobalNavigationCtx";
import {
  Breadcrumb,
  BreadcrumbButton,
  BreadcrumbDivider,
  BreadcrumbItem,
  makeStyles,
} from "@fluentui/react-components";
import { Hamburger } from "@fluentui/react-nav-preview";

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
  const { setIsOpen } = useContext(GlobalNavigationCtx);
  const classes = useClasses();

  return (
    <div className={classes.container}>
      <div className={classes.header}>
        <div className={classes.iconButtonContainer}>
          <Hamburger
            onClick={() => setIsOpen(true)}
            className={classes.iconButton}
          />
        </div>
        <div className={classes.breadcrumbContainer}>
          <div className={classes.breadcrumbGrow}>
            <Breadcrumb size="large">
              <BreadcrumbItem>
                <BreadcrumbButton href="/settings">设置</BreadcrumbButton>
              </BreadcrumbItem>
              {breadcrumbItems?.map((item) => (
                <React.Fragment key={item.key}>
                  <BreadcrumbDivider />
                  <BreadcrumbItem key={item.key}>
                    <BreadcrumbButton href={item.href}>
                      {item.title}
                    </BreadcrumbButton>
                  </BreadcrumbItem>
                </React.Fragment>
              ))}
            </Breadcrumb>
          </div>
          <div>{tailElem}</div>
        </div>
      </div>
      <div className={classes.content}>
        {children ?? (
          <StatusCard status={Status.EMPTY} content="这里空无一物" />
        )}
      </div>
    </div>
  );
}

const useClasses = makeStyles({
  container: {
    padding: "0 1.5rem",
    "@media (min-width: 640px)": {
      padding: "0 3rem",
    },
  },
  header: {
    paddingTop: "1rem",
    marginBottom: "1rem",
    "@media (min-width: 640px)": {
      paddingTop: "4rem",
    },
  },
  iconButtonContainer: {
    marginBottom: "0.5rem",
    "@media (min-width: 640px)": {
      display: "none",
    },
  },
  iconButton: {
    marginRight: "0.75rem",
  },
  breadcrumbContainer: {
    display: "flex",
    alignItems: "center",
  },
  breadcrumbGrow: {
    flexGrow: 1,
  },
  content: {
    flexGrow: 1,
  },
});
