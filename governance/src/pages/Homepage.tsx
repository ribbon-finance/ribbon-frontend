import React, { useMemo } from "react";
import { Container } from "react-bootstrap";

import useScreenSize from "shared/lib/hooks/useScreenSize";
import sizes from "shared/lib/designSystem/sizes";
import theme from "shared/lib/designSystem/theme";

const Homepage = () => {
  const { height, width } = useScreenSize();

  const containerHeight = useMemo(() => {
    return (
      height -
      theme.header.height -
      (width > sizes.lg ? 80 : theme.footer.mobile.height)
    );
  }, [height, width]);
  return (
    <>
      <Container
        style={{ height: containerHeight }}
        fluid
        className="p-0"
      ></Container>
    </>
  );
};

export default Homepage;
