import styled from "styled-components";
import {
  BaseUnderlineLink,
  BaseModalContentColumn,
  SecondaryText,
  Title,
  PrimaryText,
} from "../../designSystem";

const InfoColumn = styled(BaseModalContentColumn).attrs({
  className: "d-flex w-100 align-items-center justify-content-between",
})``;

const InfoData = styled(Title)`
  text-transform: none;
`;

interface ModalInfoColumnProps {
  label: string;
  data: string;
  type?: "primary" | "secondary";
  marginTop?: number;
}

const ModalInfoColumn: React.FC<ModalInfoColumnProps> = ({
  label,
  data,
  type = "primary",
  marginTop,
}) => {
  return (
    <InfoColumn marginTop={marginTop}>
      <SecondaryText>{label}</SecondaryText>
      <InfoData>{data}</InfoData>
    </InfoColumn>
  );
};

export default ModalInfoColumn;
