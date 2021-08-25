import { useEffect, useState } from "react";

const useTextAnimation = (
  texts: string[] = ["Loading", "Loading .", "Loading ..", "Loading ..."],
  interval: number = 1000, // in Milliseconds
  animating: boolean = true
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
