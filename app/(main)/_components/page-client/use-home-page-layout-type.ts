import { useAppStore } from "@/app/providers/app-store-provider";
import { useLargeThenMobile } from "@/utils/use-large-then-mobile";

export const useHomePageLayoutType = () => {
  const homePageLayoutTypeSelected = useAppStore((state) => state.homePageLayoutType);
  const isLargeThenMobile = useLargeThenMobile();
  return isLargeThenMobile ? homePageLayoutTypeSelected : "default";
};
