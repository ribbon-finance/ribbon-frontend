import React from "react";
import styled from "styled-components";

import sizes from "shared/lib/designSystem/sizes";

const FooterContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  flex-wrap: nowrap;

  @media (max-width: ${sizes.md}px) {
    display: none;
  }
`;

const DesktopFooter = () => {
  return <FooterContainer></FooterContainer>;
};

export default DesktopFooter;
