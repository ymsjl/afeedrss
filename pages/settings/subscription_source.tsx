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
import {
  Rename20Regular,
  Add20Regular,
  ChevronRight20Regular,
  ChevronDown20Regular,
} from "@fluentui/react-icons";
import { useSession } from "next-auth/react";
import React, { FormEventHandler, useMemo, useRef, useState } from "react";
import { useMutation, useQueryClient } from "react-query";

import SettingsLayout from "../../components/settings/layout";
import {
  useSubscriptionsListQuery,
  useFolderQuery,
  useStreamPreferencesQuery,
} from "../../components/sourcePanel/utils";
import { QUERY_KEYS } from "../../constants";
import server from "../../server";
import { Subscription } from "../../types";
import { getTagNameFromId } from "../../utils/subscriptionNavTreeBuilder";
import SubscriptionGroupedListBuilder from "./../../utils/subscriptionListTreeBuilder";
import { getLayout } from "../../components/home/layout";

interface Props {}
const useStyles = makeStyles({
  formItem: {
    display: "flex",
    flexDirection: "column",
    gap: "4px",
    ":not(:last-child)": {
      marginBottom: "16px",
    },
  },
});
function SubscriptionSource({}: Props) {
  const classes = useStyles();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedFolder, setSelectedFolder] = useState<string>();
  const { data: session } = useSession();
  const userId = session?.user?.id || "";
  const queryClient = useQueryClient();
  const subscriptionsListQuery = useSubscriptionsListQuery();
  const streamPreferencesQuery = useStreamPreferencesQuery();
  const folderQuery = useFolderQuery();

  const subscriptionsListData = subscriptionsListQuery.data;
  const folderData = folderQuery.data;
  const streamPreferencesData = streamPreferencesQuery.data;

  const { items, groups } = useMemo(() => {
    if (
      !userId ||
      !subscriptionsListData ||
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
      subscriptionById: subscriptionsListData.entities.subscription,
      tagsById: folderData.entities.folder,
      streamPrefById: streamPreferencesData.streamprefs,
    }).buildGroupedList();
  }, [userId, subscriptionsListData, folderData, streamPreferencesData]);

  const addFeedMutation = useMutation(
    ({ feedUrl, folderId }: { feedUrl: string; folderId: string }) =>
      server.inoreader.addSubscription(`feed/${feedUrl}`, folderId),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(QUERY_KEYS.SUBSCRIPTIONS_LIST);
        queryClient.invalidateQueries(QUERY_KEYS.STREAM_PREFERENCES);
        queryClient.invalidateQueries(QUERY_KEYS.FOLDER);
      },
      onError: (error) => {
        alert("Failed");
      },
    }
  );

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
    addFeedMutation.mutate({ feedUrl, folderId: String(selectedFolder) });
  };

  const dropdownOptions: { key: string; text: string }[] = useMemo(() => {
    if (folderData) {
      const {
        entities: { folder },
        result,
      } = folderData;
      return result
        .filter((key) => folder[key].type === "folder")
        .map((key) => ({
          key: folder[key].id,
          text: getTagNameFromId(folder[key].id),
        }));
    } else {
      return [];
    }
  }, [folderData]);

  return (
    <SettingsLayout
      title="订阅源"
      breadcrumbItems={[
        {
          title: "订阅源",
          key: "subscription_source",
          href: "/settings/subscription_source",
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
                    className="w-full"
                    onClick={() => setIsDialogOpen(false)}
                  >
                    取消
                  </Button>
                  <DialogTrigger disableButtonEnhancement>
                    <Button
                      appearance="primary"
                      className="w-full"
                      disabled={addFeedMutation.isLoading}
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
    </SettingsLayout>
  );
}

SubscriptionSource.getLayout = getLayout;

export default SubscriptionSource;
