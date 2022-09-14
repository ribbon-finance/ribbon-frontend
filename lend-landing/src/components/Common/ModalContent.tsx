import { useMemo } from "react";
import colors from "shared/lib/designSystem/colors";
import styled from "styled-components";

const AboutContent = styled.div`
  color: ${colors.primaryText}A3;
  padding: 16px 24px;
`;

export const ModalContent = (
  modalContentMode: "about" | "community" | undefined
) => {
  const modalContent = useMemo(() => {
    if (modalContentMode === "about") {
      return (
        <AboutContent>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit ut aliquam,
          purus sit amet luctus venenatis, lectus magna fringilla urna,
          porttitor rhoncus dolor purus non enim praesent elementum facilisis
          leo, vel fringilla est ullamcorper eget nulla facilisi etiam dignissim
          diam quis enim lobortis scelerisque fermentum dui faucibus in ornare
          quam viverra orci sagittis eu volutpat odio facilisis mauris sit amet
          massa vitae tortor condimentum lacinia
        </AboutContent>
      );
    }
    return null;
  }, [modalContentMode]);
  return modalContent;
};
