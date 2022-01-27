import React, { useMemo, useState } from "react";
import { Col, Container, Row } from "react-bootstrap";

import {
  LiquidityMiningVersion,
  LiquidityMiningVersionList,
} from "shared/lib/constants/constants";
import StakingOverview from "../../components/Staking/StakingOverview";
import LiquidityMiningPools from "../../components/Staking/LiquidityMiningPools";
import LiquidityGaugeV5Pools from "../../components/Staking/LiquidityGaugeV5Pools";

const StakingPage = () => {
  const [lmVersion, setLmVersion] = useState<LiquidityMiningVersion>(
    LiquidityMiningVersionList[0]
  );

  const pools = useMemo(() => {
    switch (lmVersion) {
      case "lm":
        return <LiquidityMiningPools />;
      case "lg5":
        return <LiquidityGaugeV5Pools />;
    }
  }, [lmVersion]);

  return (
    <Container>
      <Row className="justify-content-center">
        <Col sm="12" md="10" lg="8" xl="7" className="d-flex flex-wrap">
          <StakingOverview lmVersion={lmVersion} setLmVersion={setLmVersion} />
          {pools}
        </Col>
      </Row>
    </Container>
  );
};
export default StakingPage;
