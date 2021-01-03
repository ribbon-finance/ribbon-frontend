import React, { useState } from "react";
import styled from "styled-components";
import { Modal, Button, Statistic, Row } from "antd";
import { Straddle } from "../../models";

const ButtonStyled = styled(Button)`
  height: 100%;
  border-radius: 10px;
`;

type Props = {
  purchaseAmount: number;
  straddleETH: string;
  expiry: string;
};

const StyledStatistic = (title: string, value: string) => {
  return (
    <Statistic
      valueStyle={{ fontSize: 15, fontWeight: "bold", paddingBottom: "15px" }}
      title={title}
      value={value}
    />
  );
};

const EnableButton = (showModal: any, purchaseAmount: number) => {
  if (purchaseAmount == 0) {
    return (
      <ButtonStyled type="primary" shape="round" onClick={showModal} disabled>
        <b>Buy Now</b>
      </ButtonStyled>
    );
  } else {
    return (
      <ButtonStyled type="primary" shape="round" onClick={showModal}>
        <b>Buy Now</b>
      </ButtonStyled>
    );
  }
};

const PurchaseButton: React.FC<Props> = ({
  purchaseAmount,
  straddleETH,
  expiry,
}) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isPending, setPending] = useState(false);

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = () => {
    setPending(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  return (
    <div>
      {EnableButton(showModal, purchaseAmount)}
      <Modal
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        width={300}
        title={"Confirm Purchase"}
        footer={[
          <Button key="back" onClick={handleCancel}>
            Cancel
          </Button>,
          <Button
            key="submit"
            type="primary"
            loading={isPending}
            onClick={handleOk}
          >
            Purchase
          </Button>,
        ]}
      >
        <Row>
          {StyledStatistic("I am purchasing", `${purchaseAmount} contracts`)}
        </Row>
        <Row>{StyledStatistic("This will cost", `${straddleETH} ETH`)}</Row>
        <Row>{StyledStatistic("The contracts will expire by", expiry)}</Row>
      </Modal>
    </div>
  );
};

export default PurchaseButton;
