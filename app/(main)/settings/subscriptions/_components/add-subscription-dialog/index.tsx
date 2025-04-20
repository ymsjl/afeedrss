import React, { ComponentProps, useState, FormEventHandler, useMemo } from "react";
import { Dialog, SelectionEvents, OptionOnSelectData, DialogSurface, DialogBody, DialogTitle, DialogContent, Label, Input, Dropdown, DialogActions, Button, DialogTrigger, Option } from "@fluentui/react-components";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { getTagNameFromId } from "@/app/(main)/_components/feed-side-nav/create-nav";
import { QUERY_KEYS } from "@/constants";
import server from "@/server";
import { Folder } from "@/server/inoreader/subscription.types";
import { useClasses } from "../../useClasses";

interface Props extends Pick<ComponentProps<typeof Dialog>, 'open' | 'onOpenChange'> {
  folders: Folder[];
  onClose?: () => void;
}

export const AddSubscriptionDialog = React.memo(
  ({ open, onOpenChange, onClose, folders }: Props) => {
    const classes = useClasses();
    const [selectedFolder, setSelectedFolder] = useState<string>();
    const queryClient = useQueryClient();

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
      return folders.map((folder) => ({
        key: folder.id,
        text: getTagNameFromId(folder.id),
      }))
    }, [folders]);

    return (
      <Dialog
        open={open}
        onOpenChange={onOpenChange}
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
                    onClick={onClose}
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
    )
  }
)
