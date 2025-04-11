import React, { useMemo, useContext } from "react";
import { useRouter } from "next/router";
import qs from "query-string";
import { makeStyles, mergeClasses, Tooltip } from "@fluentui/react-components";
import {
  AppItem,
  Hamburger,
  NavCategory,
  NavCategoryItem,
  NavDivider,
  NavDrawer,
  NavDrawerBody,
  NavDrawerHeader,
  NavItem,
  NavSectionHeader,
  NavSubItem,
  NavSubItemGroup,
} from "@fluentui/react-nav-preview";
import {
  Folder20Filled,
  Folder20Regular,
  bundleIcon,
  SettingsRegular,
} from "@fluentui/react-icons";
import SubscriptionNavTreeBuilder, {
  INavLink,
} from "../../utils/subscriptionNavTreeBuilder";
import { GlobalNavigationCtx } from "./../home/layout";
import {
  useStreamPreferencesQuery,
  useSubscriptionsListQuery,
  useFolderQuery,
} from "./utils";

export interface Props {
  userId?: string;
  className?: string;
}

const useStyles = makeStyles({
  root: {
    flexShrink: 0,
  },
  nav: {},
  navItem: {
    display: "flex",
    width: "100%",
    alignItems: "center",
  },
});

const Folder = bundleIcon(Folder20Filled, Folder20Regular);

const SourcesPanel = ({ className, userId }: Props) => {
  const router = useRouter();
  const classes = useStyles();
  const { setIsOpen, isOpen } = useContext(GlobalNavigationCtx);
  const streamPreferencesQuery = useStreamPreferencesQuery();
  const folderQuery = useFolderQuery();
  const subscriptionsListQuery = useSubscriptionsListQuery();

  const subscriptionsListData = subscriptionsListQuery.data;
  const folderData = folderQuery.data;
  const streamPreferencesData = streamPreferencesQuery.data;

  const groups = useMemo(() => {
    if (
      !userId ||
      !subscriptionsListData ||
      !folderData ||
      !streamPreferencesData
    ) {
      return null;
    }
    return new SubscriptionNavTreeBuilder({
      userId,
      subscriptionById: subscriptionsListData.entities.subscription,
      tagsById: folderData.entities.folder,
      streamPrefById: streamPreferencesData.streamprefs,
    }).build();
  }, [userId, subscriptionsListData, folderData, streamPreferencesData]);

  const handleLinkClick = (
    e?: React.MouseEvent<HTMLElement>,
    item?: INavLink
  ) => {
    e?.preventDefault();
    const query = qs.stringify({ ...router.query, streamId: item?.key });
    const href = `/?${query}`;
    router.push(href, href, { shallow: true });
    // setIsOpen(false);
  };

  return (
    <NavDrawer
      defaultSelectedValue="2"
      defaultSelectedCategoryValue=""
      open={isOpen}
      type="inline"
      className={mergeClasses(classes.root, className)}
    >
      <NavDrawerHeader>
        <Tooltip content="Close Navigation" relationship="label">
          <Hamburger onClick={() => setIsOpen(!isOpen)} />
        </Tooltip>
      </NavDrawerHeader>

      <NavDrawerBody>
        {groups?.map((group, groupIndex) => (
          <React.Fragment key={groupIndex}>
            <NavSectionHeader>订阅源</NavSectionHeader>
            {group.links.map((link, linkIndex) =>
              link.type === "feed" ? (
                <NavItem
                  key={linkIndex}
                  icon={<Folder />}
                  value={link.key!}
                  onClick={(e) => handleLinkClick(e, link)}
                >
                  {link.name}
                </NavItem>
              ) : link.type === "folder" ? (
                <NavCategory key={linkIndex} value={link.key!}>
                  <NavCategoryItem icon={<Folder />}>
                    {link.name}
                  </NavCategoryItem>
                  <NavSubItemGroup>
                    {link.links?.map((subLink, subLinkIndex) => (
                      <NavSubItem
                        key={subLinkIndex}
                        value={subLink.key!}
                        onClick={(e) => handleLinkClick(e, subLink)}
                      >
                        {subLink.name}
                      </NavSubItem>
                    ))}
                  </NavSubItemGroup>
                </NavCategory>
              ) : null
            )}
          </React.Fragment>
        ))}
      </NavDrawerBody>
      <NavDivider />
      <AppItem icon={<SettingsRegular />} as="a" href="/settings">
        设置
      </AppItem>
    </NavDrawer>
  );
};

export default React.memo(SourcesPanel);
