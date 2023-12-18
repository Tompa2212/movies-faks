import { debounce } from 'lodash';
import React, { useLayoutEffect } from 'react';

type CallbackFn<T> = (...args: any[]) => T;

export function useDebounce<T>(callback: CallbackFn<T>, delayMs: number) {
  const callbackRef = React.useRef<CallbackFn<T>>(callback);

  useLayoutEffect(() => {
    callbackRef.current = callback;
  });

  return React.useMemo(
    () =>
      debounce((...args) => callbackRef.current(...args), delayMs, {
        leading: true
      }),
    [delayMs]
  );
}
