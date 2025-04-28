import React, { PropsWithChildren } from "react";
import { useClasses } from "./home-page-client.styles";
import { mergeClasses } from "@fluentui/react-components";
import { useCommonClasses } from "@/theme/commonStyles";
import { useAppStore } from "@/app/providers/app-store-provider";
import { usePrevious } from "@reactuses/core";

export const ArticleListLayout: React.FC<PropsWithChildren<{}>> = React.memo(({ children }) => {
  const classes = useClasses();
  const commonClasses = useCommonClasses();
  const layoutType = useAppStore((state) => state.layoutType);
  const isArticlePanelOpen = useAppStore((state) => state.isArticlePanelOpen);
  const scrollRef = React.useRef<HTMLDivElement>(null);
  const scrollPage = useAppStore((state) => state.articleListScrollPage);
  const scrollPagePrevious = usePrevious(scrollPage);

  React.useLayoutEffect(() => {
    if (!scrollRef.current) return;
    if (scrollPagePrevious === undefined || scrollPage === undefined) return;
    if (scrollPagePrevious !== scrollPage) {
      const direct = (scrollPage > scrollPagePrevious) ? 1 : -1;
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollTop + direct * scrollRef.current.clientHeight,
        behavior: "smooth",
      });
    };
  }, [scrollPagePrevious, scrollPage]);

  return (
    <div
      ref={scrollRef}
      tabIndex={-1}
      className={mergeClasses(
        classes.streamContentPanel,
        commonClasses.noScrollbar,
        layoutType !== "split" &&
        (isArticlePanelOpen
          ? classes.streamContentPanelClosed
          : classes.streamContentPanelOpened)
      )}
    >
      {children}
    </div>
  );
})

ArticleListLayout.displayName = "ArticleListLayout";