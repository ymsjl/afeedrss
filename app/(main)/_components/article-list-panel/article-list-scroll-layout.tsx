import React, { PropsWithChildren } from "react";
import { useAppStore } from "@/app/providers/app-store-provider";
import { usePrevious } from "@reactuses/core";

export const ArticleListScrollLayout: React.FC<PropsWithChildren<{ className?: string }>> = React.memo(({ className, children }) => {
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
      className={className}
      ref={scrollRef}
      tabIndex={-1}
    >
      {children}
    </div>
  );
})

ArticleListScrollLayout.displayName = "ArticleListScrollLayout";