import { usePrevious } from "@reactuses/core";
import { useEffect } from "react";

export const useStateChangeEffect = <T = any>(currentValue: T, cb: (previous: T | undefined, current: T) => void) => {
  const prevValue = usePrevious(currentValue);
  useEffect(() => {
    if (currentValue !== prevValue) {
      cb(prevValue, currentValue);
    }
  }, [currentValue, prevValue]);
}