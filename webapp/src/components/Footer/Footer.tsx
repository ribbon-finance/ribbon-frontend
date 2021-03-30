import React from "react";
import styled from "styled-components";

import sizes from "../../designSystem/sizes";
import AccountStatus from "../Wallet/AccountStatus";

const FooterContianer = styled.div`
  position: fixed;
  bottom: 0px;
  height: 52px;
  width: 100%;
  backdrop-filter: blur(40px);
  display: flex;
  justify-content: center;

  @media (max-width: ${sizes.md}px) {
    height: 104px;
  }
`;

const FooterOffsetContainer = styled.div`
  height: 52px;

  @media (max-width: ${sizes.md}px) {
    height: 104px;
  }
`;

const Footer = () => {
  return (
    <>
      <FooterContianer>
        {/** Desktop */}

        {/** Mobile */}
        <AccountStatus variant="mobile" />
      </FooterContianer>
      <FooterOffsetContainer />
    </>
  );
};

export default Footer;
