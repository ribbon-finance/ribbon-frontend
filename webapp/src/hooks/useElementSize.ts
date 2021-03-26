import { MutableRefObject, useCallback, useEffect, useState } from "react";

const useElementSize = (ref: MutableRefObject<HTMLElement | null>) => {
  const [height, setHeight] = useState<number>(0);
  const [width, setWidth] = useState<number>(0);

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
