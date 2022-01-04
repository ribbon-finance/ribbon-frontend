import React, { useCallback, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import styled from "styled-components";

import {
  BaseModalContentColumn,
  SecondaryText,
  Title,
} from "shared/lib/designSystem";
import SegmentPagination from "shared/lib/components/Common/SegmentPagination";
import { ActionButton } from "shared/lib/components/Common/buttons";
import colors from "shared/lib/designSystem/colors";
import { VotingPowerIcon } from "shared/lib/assets/icons/icons";
import AssetCircleContainer from "shared/lib/components/Common/AssetCircleContainer";
import { ThemedLogo } from "shared/lib/assets/icons/logo";
import theme from "shared/lib/designSystem/theme";

const ModalBackButton = styled.div`
  display: flex;
  position: absolute;
  z-index: 1000;
  align-items: center;
  justify-content: center;
  height: 40px;
  width: 40px;
  border: ${theme.border.width} ${theme.border.style} ${colors.border};
  border-radius: 40px;
`;

const ArrowBack = styled.i`
  color: ${colors.text};
  height: 14px;
`;

const DescriptionHighlight = styled.span`
  color: ${colors.primaryText};
`;

interface StakingModalExplainerProps {
  proceedToForm: () => void;
}

const StakingModalExplainer: React.FC<StakingModalExplainerProps> = ({
  proceedToForm,
}) => {
  const [page, setPage] = useState(1);

  const renderLogo = useCallback((_page: number) => {
    switch (_page) {
      case 1:
        return (
          <AssetCircleContainer
            size={104}
            color={colors.red}
            circleFractionDenominator={3.5}
          >
            <ThemedLogo theme={colors.red} />
          </AssetCircleContainer>
        );
      case 2:
        return <VotingPowerIcon />;
    }
  }, []);

  const renderTitle = useCallback((_page: number) => {
    switch (_page) {
      case 1:
        return "STAKING RBN";
      case 2:
        return "VOTING POWER";
    }
  }, []);

  const renderSubtitle = useCallback((_page: number) => {
    switch (_page) {
      case 1:
        return (
          <>
            Stake your RBN to receive{" "}
            <DescriptionHighlight>
              vote-escrowed RBN (veRBN)
            </DescriptionHighlight>
            and earn{" "}
            <DescriptionHighlight>staking rewards</DescriptionHighlight>. veRBN
            lets you participate in governance and vote on future incentive
            programs.
          </>
        );
      case 2:
        return (
          <>
            The longer you stake your RBN the more veRBN you receive. Your{" "}
            <DescriptionHighlight>
              veRBN balance represents your voting power
            </DescriptionHighlight>{" "}
            which decreases linearly as you approach the end of your staking
            period.
          </>
        );
    }
  }, []);

  return (
    <>
      {page !== 1 && (
        <ModalBackButton
          role="button"
          onClick={() => setPage((prev) => (prev === 1 ? 1 : prev - 1))}
        >
          <ArrowBack className="fas fa-arrow-left" />
        </ModalBackButton>
      )}
      <BaseModalContentColumn>
        <AnimatePresence exitBeforeEnter initial={false}>
          <motion.div
            key={page}
            className="d-flex flex-column h-100"
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -50, opacity: 0 }}
            transition={{
              duration: 0.25,
              type: "keyframes",
              ease: "easeInOut",
            }}
          >
            <div
              style={{ height: 104 }}
              className="d-flex align-items-center justify-content-center"
            >
              {renderLogo(page)}
            </div>

            <Title fontSize={22} lineHeight={28} className="text-center mt-3">
              {renderTitle(page)}
            </Title>

            <SecondaryText className="text-center mt-3" fontWeight={400}>
              {renderSubtitle(page)}
            </SecondaryText>
          </motion.div>
        </AnimatePresence>
      </BaseModalContentColumn>
      <BaseModalContentColumn marginTop="auto">
        <div style={{ width: 120 }}>
          <SegmentPagination
            page={page}
            total={2}
            onPageClick={(page) => {
              setPage(page);
            }}
            config={{
              showNavigationButton: false,
            }}
          />
        </div>
      </BaseModalContentColumn>
      <BaseModalContentColumn marginTop={40}>
        <ActionButton
          onClick={() =>
            page === 2 ? proceedToForm() : setPage((prev) => prev + 1)
          }
          className={`py-3`}
          color={colors.red}
        >
          NEXT
        </ActionButton>
      </BaseModalContentColumn>
      <BaseModalContentColumn>
        <SecondaryText
          role="button"
          className="mb-2"
          fontWeight={400}
          onClick={proceedToForm}
        >
          Skip
        </SecondaryText>
      </BaseModalContentColumn>
    </>
  );
};

export default StakingModalExplainer;
