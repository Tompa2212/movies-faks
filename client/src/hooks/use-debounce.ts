import { debounce } from 'lodash';
import React, { useLayoutEffect } from 'react';

type CallbackFn = (...args: any[]) => void;

export function useDebounce(callback: CallbackFn, delayMs: number) {
  const callbackRef = React.useRef<CallbackFn>(callback);

  useLayoutEffect(() => {
    callbackRef.current = callback;
  });

  return React.useMemo(
    () => debounce((...args) => callbackRef.current(...args), delayMs),
    [delayMs]
  );
}
