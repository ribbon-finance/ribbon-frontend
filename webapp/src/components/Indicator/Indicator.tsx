import styled from "styled-components";
import colors from "../../designSystem/colors";

const Container = styled.div`
  width: 8px;
  height: 8px;
  background-color: white;
  border-radius: 4px;
  margin-right: 8px;
  overflow: hidden;
`;

interface IndicatorProps {
	connected: boolean
}

const Indicator = ({ connected }: IndicatorProps) => {
	const backgroundColor = connected ? colors.green : 'red'
	return <Container style={{ backgroundColor }} />
}

export default Indicator;