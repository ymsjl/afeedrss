import { useCallback } from "react";
import { useSearchParams } from "next/navigation";
import { DialogOpenChangeEvent } from "@fluentui/react-components";
import { useAppStore } from "@/app/providers/app-store-provider";
import { useSearchParamNavigation } from "@/utils/use-search-param-navigation";
import { INavItem } from "./feed-nav-item.types";

export const useFeedSideNavPanelState = () => {
  const isFeedSideNavOpen = useAppStore(store => store.isFeedSideNavOpen);
  const setIsFeedSideNavOpen = useAppStore(store => store.setIsFeedSideNavOpen);
  const searchParams = useSearchParams();
  const currentStreamId = searchParams.get("streamId") || undefined;
  const navigateWithSearch = useSearchParamNavigation()

  const handleLinkClick = (
    e?: React.MouseEvent<HTMLElement>,
    item?: INavItem
  ) => {
    if (!item?.key) return;
    e?.preventDefault();
    navigateWithSearch('/', { streamId: item?.key })
  };

  const onClose = () => {
    setIsFeedSideNavOpen(false);
  }

  const onOpenChange = useCallback((e: DialogOpenChangeEvent, data: { open: boolean }) => {
    setIsFeedSideNavOpen(data.open);
  }, [setIsFeedSideNavOpen])

  return {
    isOpen: isFeedSideNavOpen,
    onOpenChange,
    onClose,
    selectedValue: currentStreamId,
    handleLinkClick,
  }
}