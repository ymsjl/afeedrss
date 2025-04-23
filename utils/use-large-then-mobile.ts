import { useAppStore } from "@/app/providers/app-store-provider";
import { breakpointQuerys } from "@/theme/tokens";
import { useMediaQuery } from "@reactuses/core";

export function useLargeThenMobile() {
  const isMobileSSR = useAppStore(store => store.isMobileSSR);
  return useMediaQuery(breakpointQuerys.medium, !isMobileSSR)
}