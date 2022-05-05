import { useTranslation } from "react-i18next";
import styled, { keyframes } from "styled-components";
import Logo from "../../assets/icons/logo";
import sizes from "../../designSystem/sizes";
import TextPreview from "../TextPreview/TextPreview";

const rotate = keyframes`
  from {
    transform: rotateY(0deg);
  }

  to {
    transform: rotateY(360deg);
  }
`;

const RotatingLogo = styled(Logo)`
  margin-right: 32px;
  animation: ${rotate} 2.5s linear infinite;

  @media (max-width: ${sizes.md}px) {
    margin-right: unset;
    margin-bottom: 32px;
  }
`;

const LogoContainer = styled.div`
  padding: 12px;
  margin-left: -12px;
`;

const Container = styled.div.attrs({
  className: "d-flex align-items-center justify-content-center",
})``;

const Geoblocked = () => {
  const { t } = useTranslation();

  return (
    <Container>
      <LogoContainer>
        <RotatingLogo height={80} width={80} />
      </LogoContainer>
      <TextPreview>
        {t("shared:GeoblockWarning:title")}
        <br />
        {t("shared:GeoblockWarning:visit")}{" "}
        <a href={t("shared:GeoblockWarning:url")}>
          {t("shared:GeoblockWarning:termsAndConditions")}
        </a>{" "}
        {t("shared:GeoblockWarning:forMoreDetails")}.
      </TextPreview>
    </Container>
  );
};

export default Geoblocked;