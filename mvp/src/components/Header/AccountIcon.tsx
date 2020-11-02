import React, { useEffect, useRef } from "react";
import { useWeb3React } from "@web3-react/core";
import styled from "styled-components";
import Jazzicon from "@metamask/jazzicon";

const StyledIdenticonContainer = styled.div`
  display: flex;
  align-items: center;
  height: 1.2rem;
  width: 1.2rem;
  border-radius: 1.25rem;
  background-color: ${({ theme }) => theme.bg4};
`;

export default function AccountIcon() {
  const ref = useRef<HTMLDivElement>();
  const { active, account } = useWeb3React();

  useEffect(() => {
    if (account && ref.current) {
      ref.current.innerHTML = "";
      ref.current.appendChild(Jazzicon(16, parseInt(account.slice(2, 10), 16)));
    }
  }, [active, account]);

  if (!active) {
    return null;
  }
  // https://github.com/DefinitelyTyped/DefinitelyTyped/issues/30451
  return <StyledIdenticonContainer ref={ref as any} />;
}
