import styled from "styled-components";

const Container = styled.div`
  width: 104px;
  height: 104px;
  padding: 16px 20px;
  padding-bottom: 8px;
`;

const Bar = styled.div<{
  color: string;
  index: number;
}>`
  background-color: ${(props) => props.color};
  height: 6.5px;
  width: 100%;
  margin-bottom: 4px;
`;

interface BoostIconProps {
  color: string;
}

const BoostIcon: React.FC<BoostIconProps> = ({ color }) => {
  return (
    <Container>
      {[...new Array(8)].map((_item, index) => (
        <Bar key={index} color={color} index={index} />
      ))}
    </Container>
  );
};

export default BoostIcon;
