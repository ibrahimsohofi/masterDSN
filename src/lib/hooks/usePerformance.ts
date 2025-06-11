import { useCallback, useRef, useEffect } from "react";

interface DebounceOptions {
  wait?: number;
  maxWait?: number;
  leading?: boolean;
  trailing?: boolean;
}

interface ThrottleOptions {
  wait: number;
  leading?: boolean;
  trailing?: boolean;
}

export function useDebounce<T extends (...args: any[]) => any>(
  callback: T,
  options: DebounceOptions = {},
) {
  const {
    wait = 300,
    maxWait = 1000,
    leading = false,
    trailing = true,
  } = options;

  const timeoutRef = useRef<NodeJS.Timeout>();
  const maxTimeoutRef = useRef<NodeJS.Timeout>();
  const lastCallRef = useRef<number>(0);
  const lastArgsRef = useRef<Parameters<T>>();

  const cleanup = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    if (maxTimeoutRef.current) {
      clearTimeout(maxTimeoutRef.current);
    }
  };

  useEffect(() => cleanup, []);

  return useCallback(
    (...args: Parameters<T>) => {
      const now = Date.now();
      lastArgsRef.current = args;

      cleanup();

      if (
        leading &&
        (!lastCallRef.current || now - lastCallRef.current >= wait)
      ) {
        lastCallRef.current = now;
        callback(...args);
        return;
      }

      timeoutRef.current = setTimeout(() => {
        if (trailing && lastArgsRef.current) {
          callback(...lastArgsRef.current);
          lastCallRef.current = Date.now();
        }
      }, wait);

      if (maxWait) {
        maxTimeoutRef.current = setTimeout(() => {
          if (lastArgsRef.current) {
            callback(...lastArgsRef.current);
            lastCallRef.current = Date.now();
          }
        }, maxWait);
      }
    },
    [callback, wait, maxWait, leading, trailing],
  );
}

export function useThrottle<T extends (...args: any[]) => any>(
  callback: T,
  options: ThrottleOptions,
) {
  const { wait, leading = true, trailing = true } = options;

  const timeoutRef = useRef<NodeJS.Timeout>();
  const lastCallRef = useRef<number>(0);
  const lastArgsRef = useRef<Parameters<T>>();

  const cleanup = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  };

  useEffect(() => cleanup, []);

  return useCallback(
    (...args: Parameters<T>) => {
      const now = Date.now();
      lastArgsRef.current = args;

      if (
        leading &&
        (!lastCallRef.current || now - lastCallRef.current >= wait)
      ) {
        lastCallRef.current = now;
        callback(...args);
        return;
      }

      if (trailing && !timeoutRef.current) {
        timeoutRef.current = setTimeout(
          () => {
            if (lastArgsRef.current) {
              callback(...lastArgsRef.current);
              lastCallRef.current = Date.now();
              timeoutRef.current = undefined;
            }
          },
          wait - (now - lastCallRef.current),
        );
      }
    },
    [callback, wait, leading, trailing],
  );
}

export function useRAF<T extends (...args: any[]) => any>(callback: T) {
  const frameRef = useRef<number>();
  const lastArgsRef = useRef<Parameters<T>>();

  const cleanup = () => {
    if (frameRef.current) {
      cancelAnimationFrame(frameRef.current);
    }
  };

  useEffect(() => cleanup, []);

  return useCallback(
    (...args: Parameters<T>) => {
      lastArgsRef.current = args;
      cleanup();

      frameRef.current = requestAnimationFrame(() => {
        if (lastArgsRef.current) {
          callback(...lastArgsRef.current);
        }
      });
    },
    [callback],
  );
}
