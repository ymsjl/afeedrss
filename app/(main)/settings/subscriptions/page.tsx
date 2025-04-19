"use client";

import {
  Dialog,
  Dropdown,
  Label,
  Input,
  Button,
  DialogSurface,
  DialogBody,
  DialogContent,
  DialogTitle,
  DialogActions,
  DialogTrigger,
  SelectionEvents,
  OptionOnSelectData,
  Option,
  makeStyles,
  TabList,
  Tab,
  List,
  ListItem,
  Image,
  tokens,
  Text,
  mergeClasses,
  SelectTabEvent,
  SelectTabData,
  Skeleton,
  SkeletonItem,
} from "@fluentui/react-components";
import { Add20Regular } from "@fluentui/react-icons";
import React, { FormEventHandler, Suspense, useMemo, useState } from "react";
import { useMutation, useQueryClient, useQuery, useSuspenseQuery } from "@tanstack/react-query";
import {
  streamPreferencesQueryOptions,
  subscriptionsQueryOptions,
  folderQueryOptions,
} from "@server/inoreader/subscription.rquery";
import { QUERY_KEYS } from "@/constants";
import server from "@server/index";
import { SettingsPageLayout } from "@/components/SettingsPageLayout";
import { NavLinkFactory } from "@/components/SourceNavPanel/FeedTreeBuilder";
import {
  Folder20Regular,
  Folder20Filled,
  Rss20Regular,
  Rss20Filled,
  Tag20Regular,
  System20Regular,
  System20Filled,
  Tag20Filled,
  bundleIcon,
} from '@fluentui/react-icons';
import { denormalize } from "normalizr";
import { folderSchema, subscriptionSchema } from "@/types/feed";
import { Folder, Subscription } from "@/server/inoreader/subscription.types";
import { useListClasses } from "@/components/StreamContentPanel/ArticleListItem";
import { useCommonClasses, useFlexClasses } from "@/theme/commonStyles";
import { TabContextProvider, TabPanel, TabPanels } from '@components/Tabs'

interface Props { }

const TAB_KEYS = {
  SUBSCRIPTIONS: "1",
  FOLDER: "2",
  TAG: "3",
  SYSTEM_FOLDER: "4",
}

const FolderIcon = bundleIcon(Folder20Filled, Folder20Regular);
const RssIcon = bundleIcon(Rss20Filled, Rss20Regular);
const TagIcon = bundleIcon(Tag20Filled, Tag20Regular);
const SystemIcon = bundleIcon(System20Filled, System20Regular);

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

function TabsWithData({ isDialogOpen, setIsDialogOpen }: { isDialogOpen: boolean, setIsDialogOpen: (open: boolean) => void }) {
  const classes = useClasses();
  const commonClasses = useCommonClasses();
  const listClasses = useListClasses();
  const flexClasses = useFlexClasses();

  const [selectedFolder, setSelectedFolder] = useState<string>();
  const queryClient = useQueryClient();
  const subscriptionsQuery = useSuspenseQuery(subscriptionsQueryOptions);
  const streamPreferencesQuery = useSuspenseQuery(streamPreferencesQueryOptions);
  const folderQuery = useQuery(folderQueryOptions);
  const [selectedTab, setSelectedTab] = useState(TAB_KEYS.SUBSCRIPTIONS)

  const subscriptionsData = subscriptionsQuery.data;
  const folderData = folderQuery.data;
  const streamPreferencesData = streamPreferencesQuery.data;

  const addFeedMutation = useMutation({
    mutationFn: ({ feedUrl, folderId }: { feedUrl: string; folderId: string }) =>
      server.inoreader.addSubscription(`feed/${feedUrl}`, folderId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.SUBSCRIPTIONS_LIST] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.STREAM_PREFERENCES] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.FOLDER] });
    },
    onError: (error: unknown) => {
      alert("Failed");
    },
  });

  const handleDropdownChange = (
    event: SelectionEvents,
    data: OptionOnSelectData
  ) => {
    setSelectedFolder(data.optionValue);
  };

  const handleOnSubmit: FormEventHandler = (e) => {
    e.preventDefault();
    const form = e.target as typeof e.target & {
      feedUrl: { value: string };
    };
    const feedUrl = form["feedUrl"].value;
    if (selectedFolder) {
      addFeedMutation.mutate({ feedUrl, folderId: selectedFolder });
    }
  };

  const dropdownOptions: { key: string; text: string }[] = useMemo(() => {
    if (folderData) {
      const {
        entities: { folder },
        result,
      } = folderData;
      return result
        .filter((key: string) => folder[key].type === "folder")
        .map((key: string) => ({
          key: folder[key].id,
          text: NavLinkFactory.getTagNameFromId(folder[key].id),
        }));
    } else {
      return [];
    }
  }, [folderData]);

  const onTabSelect = (event: SelectTabEvent, data: SelectTabData) => {
    setSelectedTab(String(data.value));
  };

  const subscriptions: Subscription[] = denormalize(subscriptionsData.result, [subscriptionSchema], subscriptionsData.entities) ?? [];
  const folders: Folder[] = denormalize(folderData?.result, [folderSchema], folderData?.entities) ?? [];

  const SubscriptionsPanel = React.memo(() => (
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
  ))

  const FoldersPanel = React.memo(() => (
    <List className={listClasses.list}>
      {folders.map(folder => {
        return (
          <ListItem key={folder.id} className={listClasses.listItem} >
            <Text>{NavLinkFactory.getTagNameFromId(folder.id)}</Text>
          </ListItem>
        )
      })}
    </List>
  ))

  return (
    <>
      <TabList selectedValue={selectedTab} onTabSelect={onTabSelect}>
        <Tab value={TAB_KEYS.SUBSCRIPTIONS} icon={<RssIcon />} >订阅源</Tab>
        <Tab value={TAB_KEYS.FOLDER} icon={<FolderIcon />} >文件夹</Tab>
        <Tab value={TAB_KEYS.TAG} icon={<TagIcon />}>标签</Tab>
        <Tab value={TAB_KEYS.SYSTEM_FOLDER} icon={<SystemIcon />}>系统文件夹</Tab>
      </TabList>
      <TabContextProvider activedValue={selectedTab}>
        <TabPanels className={classes.tabContent}>
          <TabPanel value={TAB_KEYS.SUBSCRIPTIONS}>
            <SubscriptionsPanel />
          </TabPanel>
          <TabPanel value={TAB_KEYS.FOLDER}>
            <FoldersPanel />
          </TabPanel>
        </TabPanels>
      </TabContextProvider>

      <Dialog
        open={isDialogOpen}
        onOpenChange={(ev, { open }) => setIsDialogOpen(open)}
      >
        <DialogSurface>
          <DialogBody>
            <DialogTitle>添加订阅源</DialogTitle>
            <DialogContent>
              <form onSubmit={handleOnSubmit}>
                <div className={classes.formItem}>
                  <Label>订阅源 URL</Label>
                  <Input name="feedUrl" placeholder={""} required />
                </div>
                <div className={classes.formItem}>
                  <Label>添加到文件夹</Label>
                  <Dropdown
                    value={selectedFolder ? selectedFolder : undefined}
                    onOptionSelect={handleDropdownChange}
                  >
                    {dropdownOptions.map((option) => (
                      <Option key={option.key} value={option.key}>
                        {option.text}
                      </Option>
                    ))}
                  </Dropdown>
                </div>
                <DialogActions>
                  <Button
                    className={classes.fullWidth}
                    onClick={() => setIsDialogOpen(false)}
                  >
                    取消
                  </Button>
                  <DialogTrigger disableButtonEnhancement>
                    <Button
                      appearance="primary"
                      className={classes.fullWidth}
                      disabled={addFeedMutation.isPending}
                      type="submit"
                    >
                      添加
                    </Button>
                  </DialogTrigger>
                </DialogActions>
              </form>
            </DialogContent>
          </DialogBody>
        </DialogSurface>
      </Dialog>
    </>
  )
}

const useClasses = makeStyles({
  formItem: {
    display: "flex",
    flexDirection: "column",
    gap: "4px",
    ":not(:last-child)": {
      marginBottom: "16px",
    },
  },
  feedItemContainer: {
    gap: tokens.spacingHorizontalM,
  },
  icon: {
    borderRadius: tokens.borderRadiusCircular
  },
  fullWidth: {
    width: "100%",
  },
  tabContent: {
    marginBlockStart: tokens.spacingVerticalL,
  },
  listItemSkeleton: {

  }
});


function SubscriptionSkeleton() {
  const listClasses = useListClasses();
  const classes = useClasses();
  return (
    <>
      <TabList>
        <Tab value={TAB_KEYS.SUBSCRIPTIONS} icon={<RssIcon />} >订阅源</Tab>
        <Tab value={TAB_KEYS.FOLDER} icon={<FolderIcon />} >文件夹</Tab>
        <Tab value={TAB_KEYS.TAG} icon={<TagIcon />}>标签</Tab>
        <Tab value={TAB_KEYS.SYSTEM_FOLDER} icon={<SystemIcon />}>系统文件夹</Tab>
      </TabList>
      <List className={mergeClasses(listClasses.list, classes.tabContent)}>
        {Array(5).fill(null).map(
          (_, index) =>
            <ListItem className={listClasses.listItem} key={index} >
              <ListItemSkeleton />
            </ListItem>
        )}
      </List>
    </>
  )
}

function ListItemSkeleton() {
  const classes = useClasses()
  const flexClasses = useFlexClasses()
  const commonClasses = useCommonClasses()

  return (
    <Skeleton className={commonClasses.spaceY2}>
      <div className={mergeClasses(flexClasses.flexRow, commonClasses.spaceX2)}>
        <SkeletonItem shape="circle" className={flexClasses.flexDisableShrink} size={20} />
        <SkeletonItem className={mergeClasses(classes.listItemSkeleton, flexClasses.flexGrow)} size={20} />
      </div>
      <SkeletonItem className={classes.listItemSkeleton} size={16} />
    </Skeleton>
  )
}