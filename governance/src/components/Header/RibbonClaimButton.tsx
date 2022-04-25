import styled from "styled-components";
import HeaderButtonContainer from "shared/lib/components/Common/HeaderButtonContainer";
import colors from "shared/lib/designSystem/colors";
import theme from "shared/lib/designSystem/theme";
import { useState } from "react";
import { BaseButton } from "shared/lib/designSystem";
import { ReactComponent as RevenueClaimIcon } from "../../assets/icons/revenueClaim.svg";
import RevenueClaimModal from "../RevenueClaim/RevenueClaimModal";

const Button = styled(BaseButton).attrs({
  className: "d-flex align-items-center justify-content-center",
})`
  width: 48px;
  height: 48px;
  padding: 0;
  color: ${colors.primaryText};
  font-weight: bold;
  font-size: 24px;

  &:hover {
    opacity: ${theme.hover.opacity};
  }
`;

const RibbonClaimButton = () => {
  const [claimModalOpen, setClaimModalOpen] = useState(false);

  return (
    <HeaderButtonContainer>
      <Button role="button" onClick={() => setClaimModalOpen(!claimModalOpen)}>
        <RevenueClaimIcon />
      </Button>
      <RevenueClaimModal
        show={claimModalOpen}
        onClose={() => setClaimModalOpen(false)}
      />
    </HeaderButtonContainer>
  );
};

export default RibbonClaimButton;
