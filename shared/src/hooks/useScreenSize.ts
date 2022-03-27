import { useCallback, useEffect, useMemo, useState } from "react";

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

  const [videoWidth, videoHeight] = useMemo(() => {
    /**
     * Screen size exactly 16:9
     */
    if (width / height === 16 / 9) {
      return [width, height];
    }

    /**
     * If screen are longer than 16:9
     */
    if (width / height > 16 / 9) {
      return [width, width * (9 / 16)];
    }

    return [height * (16 / 9), height];
  }, [height, width]);

  return { height, width, video: { width: videoWidth, height: videoHeight } };
};

export default useScreenSize;
