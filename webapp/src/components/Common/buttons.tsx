import styled from "styled-components";
import colors from "../../designSystem/colors";

export const Button = styled.button`
  font-family: VCR;
  width: 100%;
  border-radius: 4px;
  font-size: 16px;
  line-height: 24px;
  text-align: center;
  text-transform: uppercase;
  outline: none !important;

  &:active,
  &:focus {
    outline: none !important;
    box-shadow: none !important;
  }
`;

export const ActionButton = styled(Button)`
  background: ${colors.primaryButton};
  color: #ffffff;

  &:hover {
    color: #ffffff;
  }
`;

export const ConnectWalletButton = styled(Button)`
  background: rgba(22, 206, 185, 0.08);
  color: #16ceb9;

  &:hover {
    color: #16ceb9;
  }
`;
