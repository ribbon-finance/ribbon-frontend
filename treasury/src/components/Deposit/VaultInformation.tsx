import { getAssetDisplay } from "shared/lib/utils/asset";
import { formatAmount } from "shared/lib/utils/math";
import styled from "styled-components";
import { Col, Row } from "react-bootstrap";

import { SecondaryText, Title } from "shared/lib/designSystem";
import { Assets } from "shared/lib/store/types";
import useLoadingText from "shared/lib/hooks/useLoadingText";

const VaultDataCol = styled(Col)`
  margin-top: 20px;
  margin-bottom: 20px;
  max-width: 130px;
`;

const VerticalLineSeparator = styled(Col)`
  margin: 25px 50px 0px 0px;
  height: 25px;
  max-width: 1px;
  background: rgba(255, 255, 255, 0.16);
`;

const VaultDataLabel = styled(SecondaryText)`
  font-size: 12px;
  line-height: 16px;
  margin-bottom: 4px;
`;

const VaultData = styled(Title)`
  font-size: 16px;
  line-height: 24px;
`;

const VaultInformation: React.FC<{
  loading: boolean;
  vaultDeposit: number;
  vaultYield: number;
  asset: Assets;
}> = ({ loading, vaultDeposit, vaultYield, asset }) => {
  const loadingText = useLoadingText();
  return (
    <Row noGutters>
      <VaultDataCol xs="3">
        <VaultDataLabel className="d-block">Vault Deposits</VaultDataLabel>
        <VaultData>
          {loading
            ? loadingText
            : `${
                vaultDeposit === 0
                  ? "---"
                  : `${formatAmount(vaultDeposit)} ${getAssetDisplay(asset)}`
              }`}
        </VaultData>
      </VaultDataCol>
      <VerticalLineSeparator xs="1"></VerticalLineSeparator>
      <VaultDataCol xs="3">
        <VaultDataLabel className="d-block">Yield Earned</VaultDataLabel>
        <VaultData>
          {loading
            ? loadingText
            : `${
                vaultYield === 0
                  ? "---"
                  : `${formatAmount(vaultYield)} ${getAssetDisplay("USDC")}`
              }`}
        </VaultData>
      </VaultDataCol>
    </Row>
  );
};

export default VaultInformation;
