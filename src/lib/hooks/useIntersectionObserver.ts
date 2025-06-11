import { useEffect, type RefObject } from "react";

export function useIntersectionObserver(
  elementRef: RefObject<Element>,
  callback: IntersectionObserverCallback,
  options: IntersectionObserverInit = {
    threshold: 0.1,
    root: null,
    rootMargin: "0px",
  },
) {
  useEffect(() => {
    if (!elementRef.current) return;

    const observer = new IntersectionObserver(callback, options);
    observer.observe(elementRef.current);

    return () => observer.disconnect();
  }, [elementRef, callback, options]);
}
