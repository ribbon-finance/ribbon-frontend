import { useEffect, useState } from "react";

const useTextAnimation = (
  texts: string[], // Must be always more than 1
  interval: number = 1000 // in Milliseconds
) => {
  const [currentText, setCurrentText] = useState(texts[0]);
  const [, setCounter] = useState(0);

  useEffect(() => {
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
  }, [texts, interval]);

  return currentText;
};

export default useTextAnimation;
