import { MutableRefObject, useEffect, useState, useCallback } from "react";
import useMutationObserver from "@rooks/use-mutation-observer";
import useOnWindowScroll from "@rooks/use-on-window-scroll";

/**
 * @param element HTML element whose boundingclientrect is needed
 * @returns ClientRect
 */
function getBoundingClientRect(
  element: HTMLElement
): ClientRect | DOMRect | null {
  return element.getBoundingClientRect();
}

/**
 * useBoundingclientRect hook
 *
 * @param ref The React ref whose ClientRect is needed
 * @returns ClientRect
 */
function useBoundingclientrect(
  ref: MutableRefObject<HTMLElement | null>
): ClientRect | DOMRect | null {
  const [value, setValue] = useState<ClientRect | DOMRect | null>(null);

  const update = useCallback(() => {
    setValue(ref.current ? getBoundingClientRect(ref.current) : null);
  }, []);

  useEffect(() => {
    update();
  }, [update]);

  useMutationObserver(ref, update);

  useOnWindowScroll(update);

  return value;
}

export { useBoundingclientrect };
