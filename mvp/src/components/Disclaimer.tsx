import { CloseOutlined } from "@ant-design/icons";
import React, { useCallback, useEffect, useState } from "react";
import styled from "styled-components";

const DisclaimerContainer = styled.div`
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #e91251;
  color: white;
  z-index: 1;
  padding: 25px 80px;
  font-size: 20px;
  font-weight: 500;
  text-align: center;

  @media (max-width: 500px) {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    font-size: 18px;
    padding: 10px 10px;
  }
`;

const Disclaimer = () => {
  const [shownDisclaimer, setShownDisclaimer] = useState(true);

  const storeShownDisclaimer = useCallback(() => {
    localStorage.setItem("disclaimer", "true");
    setShownDisclaimer(true);
  }, [setShownDisclaimer]);

  useEffect(() => {
    const shownDisclaimer = localStorage.getItem("disclaimer");
    if (shownDisclaimer) {
      setShownDisclaimer(true);
    } else {
      setShownDisclaimer(false);
    }
  }, []);

  return shownDisclaimer ? null : (
    <DisclaimerContainer>
      Ribbon Finance is in alpha and has not been audited yet.
      <CloseOutlined
        onClick={storeShownDisclaimer}
        style={{ marginLeft: 30 }}
      />
    </DisclaimerContainer>
  );
};
export default Disclaimer;
