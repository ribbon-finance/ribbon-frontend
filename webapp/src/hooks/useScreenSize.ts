import { useCallback, useEffect, useState } from "react";

const useScreenSize = () => {
  const [height, setHeight] = useState<number>();
  const [width, setWidth] = useState<number>();

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

    window.onresize = () => {
      updateWidth();
      updateHeight();
    };
  }, [updateWidth, updateHeight]);

  return { height, width };
};

export default useScreenSize;
