import { MutableRefObject, useCallback, useEffect, useState } from "react";

const useElementScroll = (ref: MutableRefObject<HTMLElement | null>) => {
  const [scrollX, setScrollX] = useState<{ top: number; bottom: number }>({
    top: 0,
    bottom: 0,
  });
  const [scrollY, setScrollY] = useState<{ left: number; right: number }>({
    left: 0,
    right: 0,
  });

  const updateScroll = useCallback((element: HTMLElement) => {
    setScrollX({
      top: element.scrollTop,
      bottom: element.scrollHeight - element.clientHeight - element.scrollTop,
    });
    setScrollY({
      left: element.scrollLeft,
      right: element.scrollWidth - element.clientWidth - element.scrollLeft,
    });
  }, []);

  useEffect(() => {
    const element = ref.current;

    if (!element) {
      return;
    }

    updateScroll(element);

    const resizeScrollCallback = () => {
      updateScroll(element);
    };
    element.addEventListener("scroll", resizeScrollCallback);
    window.addEventListener("resize", resizeScrollCallback);

    return () => {
      element.removeEventListener("scroll", resizeScrollCallback);
      window.removeEventListener("resize", resizeScrollCallback);
    };
  }, [updateScroll, ref]);

  return { scrollX, scrollY };
};

export default useElementScroll;
