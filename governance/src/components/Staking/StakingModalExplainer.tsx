import React, { useCallback, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

import {
  BaseModalContentColumn,
  SecondaryText,
  Title,
} from "shared/lib/designSystem";
import SegmentPagination from "shared/lib/components/Common/SegmentPagination";
import { ActionButton } from "shared/lib/components/Common/buttons";
import colors from "shared/lib/designSystem/colors";

interface StakingModalExplainerProps {
  proceedToForm: () => void;
}

const StakingModalExplainer: React.FC<StakingModalExplainerProps> = ({
  proceedToForm,
}) => {
  const [page, setPage] = useState(1);

  const renderTitle = useCallback((_page: number) => {
    switch (_page) {
      case 1:
        return "STAKING RBN";
      case 2:
        return "VOTING POWER";
      case 3:
        return "PROTOCOL BACKSTOP";
    }
  }, []);

  const renderSubtitle = useCallback((_page: number) => {
    switch (_page) {
      case 1:
        return "Stake your RBN to participate in governance, vote on future incentive programs and earn staking rewards.";
      case 2:
        return "The longer you stake your RBN the more SRBN you receive. Your SRBN balance represents your voting power which decreases as you approach the end of your staking period.";
      case 3:
        return "All staked RBN will used to help backstop the protocol in the event that the protocol’s smart contracts are hacked or if the vaults incur losses beyond a certain threshold.";
    }
  }, []);

  return (
    <>
      <BaseModalContentColumn>
        <AnimatePresence exitBeforeEnter>
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
            <div style={{ height: 104, width: 104 }} />

            <Title fontSize={22} lineHeight={28} className="text-center mt-3">
              {renderTitle(page)}
            </Title>

            <SecondaryText className="text-center mt-3">
              {renderSubtitle(page)}
            </SecondaryText>
          </motion.div>
        </AnimatePresence>
      </BaseModalContentColumn>
      <BaseModalContentColumn marginTop="auto">
        <div style={{ width: 120 }}>
          <SegmentPagination
            page={page}
            total={3}
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
            page === 3 ? proceedToForm() : setPage((prev) => prev + 1)
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
