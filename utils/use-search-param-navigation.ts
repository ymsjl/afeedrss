import { useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";
import qs from 'query-string';

export const useSearchParamNavigation = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const navigation = useCallback((pathname: string, newParams: { [key: string]: string | string[] | null | undefined }, replace = false) => {
    const searchParamsObj = Object
      .entries(newParams)
      .reduce((acc, [key, value]) => {
        if ((value === undefined || value === null)) {
          acc[key] !== undefined && delete acc[key];
        } else {
          acc[key] = value
        }
        return acc;
      }, qs.parse(searchParams.toString()));
    const href = `${pathname}?${qs.stringify(searchParamsObj)}`
    if (replace) {
      router.replace(href);
    } else {
      router.push(href);
    }
  }, [searchParams, router]);
  return navigation;
};
