import Marquee from "react-fast-marquee/dist";
import colors from "shared/lib/designSystem/colors";
import styled from "styled-components";
import { SecondaryText, Title } from "../../designSystem";
import { delayedFade } from "../animations";

const TextContainer = styled.div`
  display: flex;
  align-items: center;
  align-self: center;
  justify-content: center;
  width: calc(100% / 3);
  min-width: 350px;
  text-align: center;
  height: 16px;
  border-right: 1px solid ${colors.tertiaryText};
  margin: auto;
  overflow: hidden;
`;

const StyledSecondaryText = styled(SecondaryText)<{ color?: string }>`
  color: ${(props) =>
    props.color === undefined ? `${colors.primaryText}` : `${props.color}`};
  font-size: 12px;
`;

const StyledTitle = styled(Title)<{
  size?: number;
  marginLeft?: number;
  marginRight?: number;
  color?: string;
}>`
  text-align: center;
  color: ${(props) =>
    props.color === undefined ? `${colors.primaryText}` : `${props.color}`};
  margin-right: ${(props) =>
    props.marginRight === undefined ? `0px` : `${props.marginRight}px`};
  margin-left: ${(props) =>
    props.marginLeft === undefined ? `0px` : `${props.marginLeft}px`};
  font-size: ${(props) =>
    props.size === undefined ? `14px` : `${props.size}px`};
  line-height: 20px;
`;

const StyledMarquee = styled(Marquee)<{ delay: number }>`
  height: 100%;
  ${delayedFade}
`;

interface Stat {
  title: string | JSX.Element;
  value: string | JSX.Element;
}

export const StatsMarquee = () => {
  const stats: Stat[] = [
    {
      title: "Total Value Locked",
      value: "$112,458,199.02",
    },
    {
      title: "Total Loans Originated",
      value: "$112,458,199.02",
    },
    {
      title: "Total Interest Accrued",
      value: "$112,458,199.02",
    },
    {
      title: "Total Insurance Accrued",
      value: "$112,458,199.02",
    },
  ];

  return (
    <StyledMarquee gradient={false} speed={50} delay={0.1} pauseOnHover>
      {stats.map((stat, i) => (
        <TextContainer key={i}>
          <StyledSecondaryText color={colors.tertiaryText}>
            {stat.title}:
          </StyledSecondaryText>
          <StyledTitle marginLeft={8} size={14}>
            {stat.value}
          </StyledTitle>
        </TextContainer>
      ))}
    </StyledMarquee>
  );
};
