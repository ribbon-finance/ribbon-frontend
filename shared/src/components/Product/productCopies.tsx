import React from "react";
import styled from "styled-components";

import { VaultOptions } from "../../constants/constants";
import colors from "../../designSystem/colors";

const Link = styled.a`
  color: ${colors.primaryText};
  text-decoration: underline;

  &:hover {
    color: ${colors.primaryText}CC;
  }
`;

interface ProductCopies {
  tags: string[];
}

export const vaultAudit = (vaultOption: VaultOptions) => {
  if (vaultOption === "rSOL-THETA") {
    return (
      <>
        The Flex Vault smart contracts are pending audit and so should be
        considered as beta software. Users are advised to exercise caution and
        only risk funds they can afford to lose.{" "}
      </>
    );
  } else {
    return (
      <>
        The Theta Vault smart contracts have been{" "}
        <Link
          href="https://blog.openzeppelin.com/ribbon-finance-audit/"
          target="_blank"
          rel="noreferrer noopener"
        >
          audited by OpenZeppelin
        </Link>{" "}
        and{" "}
        <Link
          href="https://github.com/ribbon-finance/audit/blob/master/reports/RibbonThetaVault%20V2%20Smart%20Contract%20Review%20And%20Verification.pdf"
          target="_blank"
          rel="noreferrer noopener"
        >
          ChainSafe
        </Link>
        . Despite that, users are advised to exercise caution and only risk
        funds they can afford to lose.
      </>
    );
  }
};

export const productCopies: { [vault in VaultOptions]: ProductCopies } = {
  "rETH-THETA": {
    tags: ["COVERED CALL"],
  },
  "rBTC-THETA": {
    tags: ["COVERED CALL"],
  },
  "rUSDC-ETH-P-THETA": {
    tags: ["PUT-SELLING"],
  },
  "ryvUSDC-ETH-P-THETA": {
    tags: ["PUT-SELLING"],
  },
  "rstETH-THETA": {
    tags: ["COVERED CALL"],
  },
  "rAAVE-THETA": {
    tags: ["COVERED CALL"],
  },
  "rAVAX-THETA": {
    tags: ["COVERED CALL"],
  },
  "rsAVAX-THETA": {
    tags: ["COVERED CALL"],
  },
  "rUSDC-AVAX-P-THETA": {
    tags: ["PUT-SELLING"],
  },
  "rPERP-TSRY": {
    tags: [],
  },
  "rNEAR-THETA": {
    tags: ["COVERED CALL"],
  },
  "rAURORA-THETA": {
    tags: ["COVERED CALL"],
  },
  "rSOL-THETA": {
    tags: ["COVERED CALL"],
  },
};
