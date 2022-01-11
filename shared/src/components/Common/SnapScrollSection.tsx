import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useSwipeable } from "react-swipeable";

interface SnapScrollSectionProps {
  height: number;
  items: {
    containerClassName?: string;
    child: JSX.Element;
    anchor?: boolean;
  }[];
}

const SnapScrollSection: React.FC<
  React.HTMLAttributes<HTMLDivElement> & SnapScrollSectionProps
> = ({ items, height, className, ...props }) => {
  const containerRef = useRef<HTMLDivElement>();
  const itemRefs = useMemo(
    () =>
      [...new Array(items.length)].reduce<any>((acc, _curr, index) => {
        acc[index] = React.createRef();
        return acc;
      }, {}),
    [items.length]
  );

  const [, setItemIndex] = useState(0);
  const [scrollEvent, setScrollEvent] = useState<{
    timestamp: number;
    event?: "down" | "up";
    executed: boolean;
  }>({ timestamp: Date.now(), executed: true });

  const handleScrollUp = useCallback(() => {
    setItemIndex((curr) => {
      // Unable to scroll further to the top
      if (curr <= 0) {
        return 0;
      }

      const newItemIndex = curr - 1;

      containerRef.current?.scrollTo({
        top: itemRefs[newItemIndex].current?.offsetTop,
        behavior: "smooth",
      });

      return newItemIndex;
    });
  }, [itemRefs]);

  const handleScrollDown = useCallback(() => {
    setItemIndex((curr) => {
      // Unable to scroll further to the bottom
      if (curr + 1 >= Object.keys(itemRefs).length) {
        return Object.keys(itemRefs).length - 1;
      }

      const newItemIndex = curr + 1;

      containerRef.current?.scrollTo({
        top: itemRefs[newItemIndex].current?.offsetTop,
        behavior: "smooth",
      });

      return newItemIndex;
    });
  }, [itemRefs]);

  /**
   * Handle mobile swipe
   */
  const handlers = useSwipeable({
    onSwipedUp: handleScrollDown,
    onSwipedDown: handleScrollUp,
  });

  /**
   * Handle desktop wheel event
   */
  const handleWheel = useCallback((e: globalThis.WheelEvent) => {
    setScrollEvent((curr) => {
      const timeNow = Date.now();
      /**
       * Accept a scroll event every 500ms
       */
      if (timeNow - 500 <= curr.timestamp || e.deltaY === 0) {
        return curr;
      }

      return {
        timestamp: timeNow,
        event: e.deltaY > 0 ? "down" : "up",
        executed: false,
      };
    });
  }, []);

  /**
   * Register wheel event
   */
  useEffect(() => {
    const element = containerRef.current;

    if (element) {
      element.addEventListener("wheel", handleWheel);

      return () => {
        element?.removeEventListener("wheel", handleWheel);
      };
    }
  }, [handleWheel]);

  /**
   * Perform scroll event when it had changed
   */
  useEffect(() => {
    if (scrollEvent.executed) {
      return;
    }

    switch (scrollEvent.event) {
      case "down":
        handleScrollDown();
        break;
      case "up":
        handleScrollUp();
        break;
    }

    setScrollEvent((curr) => ({ ...curr, executed: true }));
  }, [handleScrollDown, handleScrollUp, scrollEvent]);

  /**
   * For ref sharing
   */
  const refPassthrough = useCallback(
    (el: HTMLDivElement) => {
      // call useSwipeable ref prop with el
      handlers.ref(el);

      // set myRef el so you can access it yourself
      containerRef.current = el;
    },
    [handlers]
  );

  return (
    <div
      {...props}
      ref={refPassthrough}
      className={`d-flex flex-wrap overflow-hidden w-100 position-relative ${
        className || ""
      }`}
      style={{ height }}
    >
      {items.map((item, index) => (
        <div
          key={index}
          ref={itemRefs[index]}
          className={`d-flex w-100 ${item.containerClassName || ""}`}
        >
          {item.child}
        </div>
      ))}
    </div>
  );
};

export default SnapScrollSection;
