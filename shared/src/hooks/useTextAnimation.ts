import { useEffect, useState } from "react";

const useTextAnimation = (
  animating: boolean = true,
  {
    texts,
    interval,
  }: {
    texts: string[];
    interval: number;
  } = {
    texts: ["Loading", "Loading .", "Loading ..", "Loading ..."],
    interval: 250,
  }
) => {
  const [currentText, setCurrentText] = useState(texts[0]);
  const [, setCounter] = useState(0);

  useEffect(() => {
    if (animating) {
      const timeInterval = setInterval(() => {
        setCounter((curr) => {
          const newCounter = curr + 1;
          setCurrentText(texts[newCounter % texts.length]);
          return newCounter;
        });
      }, interval);

      return () => {
        clearInterval(timeInterval);
      };
    }
  }, [texts, interval, animating]);

  return currentText;
};

export default useTextAnimation;
