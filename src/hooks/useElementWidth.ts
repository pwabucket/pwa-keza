import { useLayoutEffect, useState } from "react";

/** Content width of an element, kept up to date as it resizes */
export default function useElementWidth(
  ref: React.RefObject<HTMLElement | null>,
) {
  const [width, setWidth] = useState(0);

  useLayoutEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new ResizeObserver(([entry]) =>
      setWidth(entry.contentRect.width),
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [ref]);

  return width;
}
