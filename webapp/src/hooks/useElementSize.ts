import { MutableRefObject, useCallback, useEffect, useState } from "react";

const useElementSize = (ref: MutableRefObject<HTMLElement | null>) => {
  const [height, setHeight] = useState<number>();
  const [width, setWidth] = useState<number>();

  const updateWidth = useCallback(() => {
    if (ref.current) setWidth(ref.current.clientWidth);
  }, [ref]);

  const updateHeight = useCallback(() => {
    if (ref.current) setHeight(ref.current.clientHeight);
  }, [ref]);

  useEffect(() => {
    updateWidth();
    updateHeight();

    window.addEventListener("resize", () => {
      updateWidth();
      updateHeight();
    });
  }, [updateWidth, updateHeight]);

  return { height, width };
};

export default useElementSize;
