import React, { useEffect, useState } from "react";
import { Row } from "react-bootstrap";
import colors from "shared/lib/designSystem/colors";
import styled from "styled-components";
import { components } from "../../designSystem/components";
import sizes from "../../designSystem/sizes";
import { VaultOptions } from "../../constants/constants";
import { CloseIcon } from "shared/lib/assets/icons/icons";
import Header from "./Header";
import Footer from "./Footer";
import Hero from "./Hero";

const borderStyle = `1px solid ${colors.primaryText}1F`;

const FixedContainer = styled.div`
  position: fixed;
  display: flex;
  justify-content: center;
  align-items: center;
  background: black;
  z-index: 100;
  width: 100%;
  height: 100%;
`;

const HeroContainer = styled.div`
  display: flex;
  height: 100%;
  flex-direction: column;
  justify-content: space-between;
  width: 100%;

  @media (max-width: ${sizes.lg}px) {
    width: 100%;
  }

  > .row {
    margin-left: 0 !important;
    width: 100%;
  }
`;

const Content = styled(Row)`
  height: calc(100% - ${components.header}px - ${components.footer}px);

  @media (max-width: ${sizes.lg}px) {
    height: 100%;
  }

  > *:not(:last-child) {
    border-right: 1px solid ${colors.border};
  }
`;

const CloseButton = styled.button`
  position: absolute;
  right: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: none;
  border: none;
  width: ${components.header}px;
  height: ${components.header}px;
  border-left: ${borderStyle};
`;

export enum ActionModalEnum {
  PREVIEW,
  TRANSACTION_STEP,
}

interface ActionMMModalProps {
  show: boolean;
  onHide: () => void;
  pool: VaultOptions;
}

const ActionMMModal: React.FC<ActionMMModalProps> = ({
  show,
  onHide,
  pool,
}) => {
  const [page, setPage] = useState<ActionModalEnum>(ActionModalEnum.PREVIEW);
  const [txhash, setTxhashMain] = useState<string>();
  const [triggerAnimation, setTriggerAnimation] = useState<boolean>(true);
  const [borrowAmount, setBorrowAmount] = useState<string>("");
  const [isBorrow, setIsBorrow] = useState<boolean>(true);

  // stop trigger animation on rerenders
  useEffect(() => {
    let timeout: NodeJS.Timeout | null = null;
    if (show) {
      timeout = setTimeout(() => {
        setTriggerAnimation(false);
      }, 1800);
    } else {
      clearTimeout(timeout!);
      setTriggerAnimation(true);
    }

    return () => {
      clearTimeout(timeout!);
    };
  }, [show]);

  return show ? (
    <FixedContainer>
      <HeroContainer>
        <Header isBorrow={isBorrow}>
          <CloseButton onClick={() => onHide()}>
            <CloseIcon />
          </CloseButton>
        </Header>
        <Content>
          <Hero
            pool={pool}
            page={page}
            setPage={setPage}
            setTxhashMain={setTxhashMain}
            setIsBorrow={setIsBorrow}
            onHide={() => onHide()}
            show={show}
            triggerAnimation={triggerAnimation}
            setBorrowAmount={setBorrowAmount}
          />
        </Content>
        <Footer
          pool={pool}
          page={page}
          txhash={txhash}
          show={show}
          borrowAmount={borrowAmount}
          isBorrow={isBorrow}
        />
      </HeroContainer>
    </FixedContainer>
  ) : (
    <></>
  );
};

export default ActionMMModal;
