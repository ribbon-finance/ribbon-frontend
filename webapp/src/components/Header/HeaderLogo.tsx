import { useWeb3React } from "@web3-react/core";
import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Title } from "shared/lib/designSystem";
import colors from "shared/lib/designSystem/colors";
import styled from "styled-components";

import Ribbon from "../../assets/img/RibbonLogo.svg";
import AirdropModal from "../Airdrop/AirdropModal";

const LogoContainer = styled.div`
  display: flex;
  background: linear-gradient(
    96.84deg,
    ${colors.red}24 1.04%,
    ${colors.red}0F 98.99%
  );
  border-radius: 48px;
`;

const ClaimableContianer = styled.div`
  display: flex;
  align-items: center;
  padding: 0px 16px 0px 8px;
`;

const ClaimAmount = styled(Title)`
  color: ${colors.red};
  font-size: 14px;
  line-height: 24px;
`;

const HeaderLogo = () => {
  // Update the set amount logic
  const [amount] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const { account } = useWeb3React();

  const amountStr = useMemo(() => {
    if (!account) {
      return "$RIBBON";
    }

    if (!amount) {
      return "0.00";
    }

    return amount;
  }, [amount, account]);

  return (
    <>
      <LogoContainer>
        <Link to="/">
          <img
            src={Ribbon}
            alt="Ribbon Finance"
            style={{ height: 48, width: 48 }}
          />
        </Link>
        <ClaimableContianer
          role="button"
          onClick={() => setShowModal((show) => !show)}
        >
          <ClaimAmount>{amountStr}</ClaimAmount>
        </ClaimableContianer>
      </LogoContainer>
      <AirdropModal
        show={showModal}
        onClose={() => {
          console.log("lol");
          setShowModal(false);
        }}
      />
    </>
  );
};

export default HeaderLogo;
