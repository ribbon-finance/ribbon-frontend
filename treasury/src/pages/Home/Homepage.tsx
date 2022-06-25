import styled from "styled-components";
import sizes from "shared/lib/designSystem/sizes";
import theme from "shared/lib/designSystem/theme";
import useScreenSize from "shared/lib/hooks/useScreenSize";
import usePullUp from "webapp/lib/hooks/usePullUp";
import { useHistory } from "react-router-dom";
import { VaultName, VaultNameOptionMap } from "shared/lib/constants/constants";
import ReactPlayer from "react-player";
import colors from "shared/lib/designSystem/colors";
import { ExternalIcon } from "shared/lib/assets/icons/icons";
import { useCallback, useMemo, useRef, useState } from "react";

const HomepageContainer = styled.div`
  display: flex;
  justify-content: space-around;
  width: 100%;
`;

const FloatingContainer = styled.div<{ footerHeight?: number }>`
  width: 100%;
  height: calc(
    100vh - ${theme.header.height}px -
      ${(props) => (props.footerHeight ? props.footerHeight + 48 : 48)}px
  );
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  min-height: 600px;
  position: relative;

  @media (max-width: ${sizes.md}px) {
    flex-direction: column;
  }
`;

const PlayerContainer = styled(ReactPlayer)`
  height: 400px;
  width: 100%;
  position: absolute;
  pointer-events: none !important;
  z-index: -1;
`;

const LandingContent = styled.div`
  text-align: center;

  > *:not(:last-child) {
    margin-bottom: 16px !important;
  }

  h1 {
    color: white;
    font-size: 56px;
    font-family: VCR;
    text-transform: uppercase;
  }

  p {
    font-size: 16px;
    color: ${colors.text};
  }
`;

const ProductText = styled.p`
  font-size: 10px !important;

  > * {
    display: inline-flex;
  }

  a {
    color: ${colors.text};
    text-decoration: underline;

    span {
      display: block;
      margin-left: 4px;
    }
  }
`;

const AccessLink = styled.a`
  font-size: 14px;
  color: ${colors.primaryText};
  padding: 8px 16px;
  background: none;
  border: 1px solid white;
  border-radius: 6px;
  display: block;
  margin: auto;
  font-family: VCR;
  text-transform: uppercase;
  width: fit-content;

  &:hover {
    background-color: ${colors.primaryText};
    color: black;
    text-decoration: none;
  }
`;

const LandingSteps = styled.div<{ totalSteps: number }>`
  position: absolute;
  bottom: 48px;
  display: flex;
  transition: 0.2s;

  @media (max-width: calc(1000px + 160px)) {
    display: none;
  }
`;

const Step = styled.div`
  width: 300px;
  border-bottom: 4px solid ${colors.background.four};

  &:not(:last-of-type) {
    margin-right: 50px;
  }
`;

const StepTitle = styled.h6`
  color: ${colors.primaryText};
  font-family: VCR;
  text-align: center;
`;

const StepContent = styled.p`
  color: ${colors.text};
  text-align: center;
  font-size: 14px;
`;
interface Step {
  title: string;
  content: string;
  interval?: number;
}

const Homepage = () => {
  usePullUp();
  const history = useHistory();
  const { video } = useScreenSize();
  const auth = localStorage.getItem("auth");
  const [footerRef, setFooterRef] = useState<HTMLDivElement | null>(null);

  const steps: Step[] = [
    {
      title: "01",
      content:
        "Diversify your DAO's treasury holdings by earning premiums in stables",
    },
    {
      title: "02",
      content:
        "Customise your covered call strike selection methodology, tenor and premium currency",
    },
    {
      title: "03",
      content:
        "Leverage Ribbon's network of market makers to boostrap a market",
    },
  ];

  if (auth) {
    const vault = JSON.parse(auth).pop();
    if (vault) {
      let vaultName;
      Object.keys(VaultNameOptionMap).filter((name) => {
        if (VaultNameOptionMap[name as VaultName] === vault) {
          vaultName = name;
        }
        return null;
      });
      history.push("/treasury/" + vaultName);
    }
  }

  const onSetFooterRef = useCallback((ref) => {
    setFooterRef(ref);
  }, []);

  return (
    <HomepageContainer>
      <FloatingContainer footerHeight={footerRef?.offsetHeight}>
        <PlayerContainer
          key="video-player"
          url="https://player.vimeo.com/video/722230744?h=772ecba04a&badge=0&autopause=0&player_id=0&app_id=58479"
          playing={true}
          width={"100vw"}
          height={video.height}
          style={{
            maxWidth: "100vw",
            maxHeight: "100vh",
          }}
          config={{ vimeo: { playerOptions: { background: true } } }}
          muted
          loop
        />
        <LandingContent>
          <h1>Treasury</h1>
          <p>Earn yield on your protocol's native token</p>
          <AccessLink
            href="https://d9gte6lu2ax.typeform.com/to/ZaNFY9zP"
            target="_blank"
            rel="noopener noreferrer"
          >
            Apply for access
          </AccessLink>
          <ProductText>
            A product by{" "}
            <a
              href="https://ribbon.finance"
              target="_blank"
              rel="noopener noreferrer"
            >
              Ribbon Finance <ExternalIcon height={12} width={12} />
            </a>
          </ProductText>
        </LandingContent>
      </FloatingContainer>
      <LandingSteps ref={onSetFooterRef} totalSteps={steps.length}>
        {steps.map((step) => (
          <Step>
            <StepTitle>{step.title}</StepTitle>
            <StepContent>{step.content}</StepContent>
          </Step>
        ))}
      </LandingSteps>
    </HomepageContainer>
  );
};

export default Homepage;
