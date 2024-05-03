import { useCallback } from "react";
import {
  BaseIndicator,
  Subtitle
} from "shared/lib/designSystem";
import { CloseIcon } from "shared/lib/assets/icons/icons";
import colors from "shared/lib/designSystem/colors";
import theme from "shared/lib/designSystem/theme";
import { AirdropBreakdownKeys } from "shared/lib/store/types";
import styled from "styled-components";

export const getQualifiedColor = (qualified: boolean) => {
  return qualified ? colors.green : colors.red
}

const getAirdropTitle = (variant: AirdropBreakdownKeys) => {
  switch (variant) {
    case AirdropBreakdownKeys.maxStaked:
      return "Max Staked RBN";
    case AirdropBreakdownKeys.heldRbnAfterTGE:
      return "Held RBN until Aevo TGE";
  }
};

const BreakdownContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  width: 100%;
`;

const BreakdownBackground = styled.div<{
  qualified: boolean;
}>`
  background: ${(props) => getQualifiedColor(props.qualified)}14;
  border-radius: 16px 16px 8px 8px;
  margin: 16px 16px 0px 16px;
  width: 100%;
`;

const BreakdownPill = styled.div<{
  qualified: boolean;
}>`
  display: flex;
  align-items: center;
  padding: 8px 12px;
  border: ${theme.border.width} ${theme.border.style}
    ${(props) => getQualifiedColor(props.qualified)};
  border-radius: 100px;
`;

const BreakdownPillToken = styled(Subtitle) <{
  qualified: boolean;
}>`
  color: ${(props) => getQualifiedColor(props.qualified)};
  margin-right: auto;
`;

interface AirdropBreakdownProps {
  breakdown?: {
    [key in AirdropBreakdownKeys]: boolean
  }
}

const AirdropBreakdown = ({ breakdown }: AirdropBreakdownProps) => {
  const renderBreakdownPill = useCallback(
    (key: AirdropBreakdownKeys, qualified: boolean) => (
      <BreakdownBackground qualified={qualified} key={key}>
        <BreakdownPill qualified={qualified}>
          <BreakdownPillToken qualified={qualified}>
            {getAirdropTitle(key)}
          </BreakdownPillToken>
          {
            qualified
              ? (
                <BaseIndicator
                  size={8}
                  color={getQualifiedColor(qualified)}
                />
              ) : (
                <CloseIcon width={8} height={8} stroke={getQualifiedColor(qualified)} />
              )
          }
        </BreakdownPill>
      </BreakdownBackground>
    ),
    []
  );

  return (
    <BreakdownContainer>
      {
        breakdown
          ? Object.keys(breakdown).map((key) =>
            renderBreakdownPill(
              key as AirdropBreakdownKeys,
              breakdown[key as AirdropBreakdownKeys]
            )
          )
          : (
            <>
              {
                renderBreakdownPill(
                  AirdropBreakdownKeys.maxStaked,
                  false
                )
              }
              {
                renderBreakdownPill(
                  AirdropBreakdownKeys.heldRbnAfterTGE,
                  false
                )
              }
            </>
          )
      }
    </BreakdownContainer>
  );
};

export default AirdropBreakdown;
