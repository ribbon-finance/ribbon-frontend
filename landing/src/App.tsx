import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { Web3ReactProvider } from "@web3-react/core";
import { ConnectionProvider } from "@solana/wallet-adapter-react";

import { Web3ContextProvider } from "shared/lib/hooks/web3Context";
import { getLibrary } from "shared/lib/utils/getLibrary";
import { Web3DataContextProvider } from "shared/lib/hooks/web3DataContext";
import { SubgraphDataContextProvider } from "shared/lib/hooks/subgraphDataContext";
import { ExternalAPIDataContextProvider } from "shared/lib/hooks/externalAPIDataContext";
import { ChainContextProvider } from "shared/lib/hooks/chainContext";

import Header from "./components/Header";
import Hero from "./components/Hero";
import ProductCarousel from "./components/ProductCarousel";
import Mission from "./components/Mission";
import Footer from "./components/Footer";
import Investors from "./components/Investors";
import PolicyPage from "./pages/PolicyPage";
import TermsPage from "./pages/TermsPage";
import FAQPage from "./pages/FAQ";
import colors from "shared/lib/designSystem/colors";
import { getSolanaClusterURI } from "shared/lib/utils/env";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import useScreenSize from "shared/lib/hooks/useScreenSize";
import github from "./img/Footer/github.svg";
import discord from "./img/Footer/discord.svg";
import twitter from "./img/Footer/twitter.svg";
import globe from "./img/Footer/globe.svg";
import sizes from "./designSystem/sizes";
import { AppLogo } from "shared/lib/assets/icons/logo";
import { motion } from "framer";

const Body = styled.div`
  background-color: ${colors.background.one};
`;

const MainContainer = styled.div`
  > * {
    margin-bottom: 80px;
  }
`;

const StickyFooter = styled.div`
  width: 100%;
  height: fit-content;
  justify-content: space-between;
  position: sticky;
  bottom: 0;
  display: flex;

  > * {
    display: flex;
    margin: auto;
    width: 100%;
    justify-content: center;

    &:first-child {
      justify-content: flex-start;
    }

    &:last-child {
      justify-content: flex-end;
    }
  }
`;

function App() {
  return (
    <ChainContextProvider>
      <ConnectionProvider endpoint={getSolanaClusterURI()}>
        <Web3ContextProvider>
          <Web3ReactProvider getLibrary={getLibrary}>
            <Web3DataContextProvider>
              <SubgraphDataContextProvider>
                <ExternalAPIDataContextProvider>
                  <Body>
                    <Router>
                      <Header />

                      <Switch>
                        <Route path="/" exact>
                          <MainContainer>
                            <Hero />
                            <ProductCarousel />
                            <Mission />
                            <Investors />
                          </MainContainer>
                        </Route>

                        <Route path="/policy">
                          <PolicyPage></PolicyPage>
                        </Route>

                        <Route path="/terms">
                          <TermsPage></TermsPage>
                        </Route>

                        <Route path="/faq">
                          <FAQPage></FAQPage>
                        </Route>
                      </Switch>

                      <Footer />
                    </Router>
                    <StickyFooter>
                      <div>
                        <p>Hi</p>
                      </div>
                      <div>
                        <Scroller />
                      </div>
                      <div>
                        <SocialMedia />
                      </div>
                    </StickyFooter>
                  </Body>
                </ExternalAPIDataContextProvider>
              </SubgraphDataContextProvider>
            </Web3DataContextProvider>
          </Web3ReactProvider>
        </Web3ContextProvider>
      </ConnectionProvider>
    </ChainContextProvider>
  );
}

const Progress = styled(CircularProgressbar)`
  position: sticky;
  color: white;
  width: 64px;
  height: 64px;
  left: 0;
  text-align: center;

  > * {
    width: fit-content;
  }
`;

const ProgressContainer = styled.div<{ highlight: boolean }>`
  height: fit-content;
  width: fit-content;
  margin-bottom: 24px;
  border-radius: 50%;
  position: relative;

  ${(props) =>
    props.highlight &&
    `
    transition: 0.2s;
    box-shadow: 0px 0px 40px rgba(252, 10, 84, 0.64) !important;
  `};
`;

const ProgressLogo = styled(motion.div)<{ dimensions: number; margin: number }>`
  position: absolute;
  transform: translateX(${(props) => props.margin}px)
    translateY(${(props) => props.margin}px);
  left: 0;
  top: 0;
  display: flex;

  > * {
    animation: 2s fadeInDown;
    height: ${(props) => props.dimensions}px;
    width: ${(props) => props.dimensions}px;
  }
`;

const Scroller = () => {
  const { height } = useScreenSize();
  const [progress, setProgress] = useState<number>(0);

  useEffect(() => {
    window.addEventListener("scroll", () => {
      setProgress(
        (window.scrollY / (document.body.clientHeight - height)) * 100
      );
    });
  }, [height]);

  return (
    <ProgressContainer highlight={progress > 99}>
      <Progress
        value={progress}
        styles={buildStyles({
          // Rotation of path and trail, in number of turns (0-1)
          rotation: 0,

          // Whether to use rounded or flat corners on the ends - can use 'butt' or 'round'
          strokeLinecap: "round",

          // How long animation takes to go from one percentage to another, in seconds
          pathTransitionDuration: 0.25,

          // Colors
          pathColor: progress > 99 ? colors.red : `#ffffff`,
          trailColor: "#1C1C22AA",
          backgroundColor: "#00000000",
        })}
      />

      {progress > 99 && (
        <ProgressLogo
          dimensions={32}
          margin={16}
          transition={{
            duration: 0.5,
            type: "keyframes",
            ease: "easeInOut",
          }}
          initial={{
            opacity: 0,
          }}
          animate={{
            opacity: 1,
          }}
          exit={{
            opacity: 0,
          }}
        >
          <AppLogo />
        </ProgressLogo>
      )}
      {progress <= 99 && (
        <ProgressLogo
          dimensions={20}
          margin={22}
          transition={{
            duration: 0.5,
            type: "keyframes",
            ease: "easeInOut",
          }}
          initial={{
            opacity: 0,
          }}
          animate={{
            opacity: 1,
          }}
          exit={{
            opacity: 0,
          }}
        >
          <img alt="scroll-indicator" src={globe} />
        </ProgressLogo>
      )}
    </ProgressContainer>
  );
};

const Socials = styled.div`
  background: rgba(255, 255, 255, 0.04);
  backdrop-filter: blur(40px);
  border-radius: 100px;
  margin-bottom: 24px;
  margin-right: 24px;

  @media (max-width: ${sizes.md}px) {
    display: none;
  }
`;

const SocialButton = styled.button`
  justify-content: center;
  cursor: pointer;
  margin: 0 $spacing-2;
  transition: 0.5s;
  background: none;
  border: none;
  padding: 20px;

  img {
    width: 24px;
    height: 24px;
  }

  &:hover {
    transition: 0.5s;

    > img {
      transition: 0.75s;
      filter: brightness(3);
    }
  }
`;

const SocialMedia = () => {
  return (
    <Socials>
      <SocialButton>
        <img src={github} alt="github" />
      </SocialButton>
      <SocialButton>
        <img src={discord} alt="discord" />
      </SocialButton>
      <SocialButton>
        <img src={twitter} alt="twitter" />
      </SocialButton>
    </Socials>
  );
};

export default App;
