import { MutableRefObject, useCallback, useEffect, useState } from "react";
import useMutationObserver from "@rooks/use-mutation-observer";

const useElementSize = (
  ref: MutableRefObject<HTMLElement | null>,
  config = { mutationObserver: true }
) => {
  const [height, setHeight] = useState<number>(0);
  const [width, setWidth] = useState<number>(0);

  const updateDimension = useCallback(() => {
    const element = ref.current;
    if (!element) return;

    setWidth(element.clientWidth);
    setHeight(element.clientHeight);
  }, [ref]);

  useMutationObserver(
    ref,
    () => {
      if (!config.mutationObserver) return;

      updateDimension();
    },
    { subtree: true, childList: true }
  );

  useEffect(() => {
    updateDimension();

    const resizeCallback = () => {
      updateDimension();
    };

    window.addEventListener("resize", resizeCallback);

    return () => window.removeEventListener("resize", resizeCallback);
  }, [updateDimension]);

  return { height, width };
};

export default useElementSize;
