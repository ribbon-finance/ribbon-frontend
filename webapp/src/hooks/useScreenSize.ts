import { useCallback, useEffect, useState } from "react";

const useScreenSize = () => {
  const [height, setHeight] = useState<number>(0);
  const [width, setWidth] = useState<number>(0);

  const updateWidth = useCallback(() => {
    setWidth(Math.max(window.innerWidth, document.documentElement.clientWidth));
  }, []);

  const updateHeight = useCallback(() => {
    setHeight(
      Math.max(window.innerHeight, document.documentElement.clientHeight)
    );
  }, []);

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

export default useScreenSize;
