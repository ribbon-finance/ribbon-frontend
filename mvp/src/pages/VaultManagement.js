import React from "react";
import { Row, Col } from "antd";
import VaultStatus from "../components/VaultStatus";
import VaultActions from "../components/VaultActions";

const VaultManagement = () => {
  return (
    <Row style={{ paddingTop: 50 }} gutter={[4, 8]}>
      <Col span={4}>
        <VaultStatus></VaultStatus>
      </Col>
      <Col span={8}>
        <VaultActions></VaultActions>
      </Col>
    </Row>
  );
};

export default VaultManagement;
