"use client";

import {
  Tree,
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
  TreeItem,
  TreeItemLayout,
  makeStyles,
} from "@fluentui/react-components";
import { Add20Regular } from "@fluentui/react-icons";
import { useSession } from "next-auth/react";
import React, { FormEventHandler, useMemo, useState } from "react";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import {
  streamPreferencesQueryOptions,
  subscriptionsQueryOptions,
  folderQueryOptions,
} from "@server/inoreader/subscription.rquery";
import { QUERY_KEYS } from "@/constants";
import server from "@server/index";
import { SettingsPageLayout } from "@/components/SettingsPageLayout";
import { SubscriptionNavTreeBuilder } from "@components/SourceNavPanel/subscriptionNavTreeBuilder";
import SubscriptionGroupedListBuilder from "@components/SourceNavPanel/subscriptionListTreeBuilder";

interface Props { }

export default function SubscriptionSource({ }: Props) {
  const classes = useClasses();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedFolder, setSelectedFolder] = useState<string>();
  const { data: session } = useSession();
  const userId = session?.user?.id || "";
  const queryClient = useQueryClient();
  const subscriptionsQuery = useQuery(subscriptionsQueryOptions);
  const streamPreferencesQuery = useQuery(streamPreferencesQueryOptions);
  const folderQuery = useQuery(folderQueryOptions);

  const subscriptionsData = subscriptionsQuery.data;
  const folderData = folderQuery.data;
  const streamPreferencesData = streamPreferencesQuery.data;

  const { items, groups } = useMemo(() => {
    if (
      !userId ||
      !subscriptionsData ||
      !folderData ||
      !streamPreferencesData
    ) {
      return {
        items: [],
        groups: [],
      };
    }
    return new SubscriptionGroupedListBuilder({
      userId,
      subscriptionById: subscriptionsData.entities.subscription,
      tagsById: folderData.entities.folder,
      streamPrefById: streamPreferencesData.streamprefs,
    }).buildGroupedList();
  }, [userId, subscriptionsData, folderData, streamPreferencesData]);

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
          text: SubscriptionNavTreeBuilder.getTagNameFromId(folder[key].id),
        }));
    } else {
      return [];
    }
  }, [folderData]);

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
      <Tree selectionMode="multiselect">
        {groups.map((group, groupIndex) => (
          <TreeItem key={groupIndex} itemType="branch">
            <TreeItemLayout>{group.name}</TreeItemLayout>
            <Tree>
              {items
                .slice(group.startIndex, group.startIndex + group.count)
                .map((item) => (
                  <TreeItem itemType="leaf" key={item.id}>
                    <TreeItemLayout>{item.title}</TreeItemLayout>
                  </TreeItem>
                ))}
            </Tree>
          </TreeItem>
        ))}
      </Tree>
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
    </SettingsPageLayout>
  );
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
  fullWidth: {
    width: "100%",
  },
});
