"use client";

import { useEffect } from "react";
import NProgress from "nprogress";
import "nprogress/nprogress.css";
import { useIsFetching } from "@tanstack/react-query";

NProgress.configure({ showSpinner: false });

export function NProgressProvider() {
  const isFetching = useIsFetching();

  useEffect(() => {
    if (isFetching > 0) {
      NProgress.start();
    } else {
      NProgress.done();
    }
  }, [isFetching]);

  return null;
}
