import { useEffect } from "react";

const usePullUp = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
};
export default usePullUp;
