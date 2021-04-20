import React from "react";
import styled from "styled-components";
import { VaultList } from "../../constants/constants";
import YieldCard from "./Product/YieldCard";

const ScrollContainer = styled.div`
  display: flex;
  overflow-x: scroll;
  margin: -80px -15px -40px -15px;
`;

const Vaults = styled.div`
  padding: 80px 12px 40px 12px;
`;

const MobileThetaProducts = () => {
  return (
    <ScrollContainer>
      <Vaults className="d-flex">
        {VaultList.map((vault) => (
          <YieldCard key={vault} vault={vault} />
        ))}
      </Vaults>
    </ScrollContainer>
  );
};

export default MobileThetaProducts;
