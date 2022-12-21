import React, { useEffect, useState } from "react";
import { Row } from "react-bootstrap";
import colors from "shared/lib/designSystem/colors";
import styled from "styled-components";
import { components } from "../../designSystem/components";
import sizes from "../../designSystem/sizes";
import { PoolList, PoolOptions } from "shared/lib/constants/lendConstants";
import { CloseIcon } from "shared/lib/assets/icons/icons";
import { ActionType } from "./types";
import Footer from "./Footer";
import Header from "./Header";
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

interface ActionModalProps {
  show: boolean;
  actionType: ActionType;
  onHide: () => void;
  pool: PoolOptions;
}

const ActionModal: React.FC<ActionModalProps> = ({
  show,
  actionType,
  onHide,
  pool,
}) => {
  const [page, setPage] = useState<ActionModalEnum>(ActionModalEnum.PREVIEW);
  const [migratePool, changeMigratePool] = useState(PoolList[0]);
  const [triggerAnimation, setTriggerAnimation] = useState<boolean>(true);

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

  const [txhash, setTxhashMain] = useState<string>();
  return show ? (
    <FixedContainer>
      <HeroContainer>
        <Header page={page} actionType={actionType} pool={pool}>
          <CloseButton onClick={() => onHide()}>
            <CloseIcon />
          </CloseButton>
        </Header>
        <Content>
          <Hero
            actionType={actionType}
            pool={pool}
            page={page}
            setPage={setPage}
            setTxhashMain={setTxhashMain}
            onHide={() => onHide()}
            show={show}
            triggerAnimation={triggerAnimation}
            migratePool={migratePool}
            changeMigratePool={changeMigratePool}
          />
        </Content>
        <Footer
          pool={pool}
          page={page}
          txhash={txhash}
          show={show}
          actionType={actionType}
          migratePool={migratePool}
        />
      </HeroContainer>
    </FixedContainer>
  ) : (
    <></>
  );
};

export default ActionModal;
