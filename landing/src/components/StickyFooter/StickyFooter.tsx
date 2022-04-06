import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import useScreenSize from "shared/lib/hooks/useScreenSize";
import github from "../../img/Footer/github.svg";
import discord from "../../img/Footer/discord.svg";
import twitter from "../../img/Footer/twitter.svg";
import chevron from "../../img/Footer/chevron.svg";
import globe from "../../img/Footer/globe.svg";
import { AppLogo } from "shared/lib/assets/icons/logo";
import { motion } from "framer";
import {
  Chains,
  READABLE_CHAIN_NAMES,
  VaultOptions,
} from "shared/lib/constants/constants";
import { Assets } from "shared/lib/store/types";
import { getAssetLogo } from "shared/lib/utils/asset";
import styled from "styled-components";
import { useEffect, useState } from "react";
import colors from "shared/lib/designSystem/colors";
import sizes from "../../designSystem/sizes";
import useTVL from "shared/lib/hooks/useTVL";
import { formatAmount } from "shared/lib/utils/math";
import { BaseLink } from "../../designSystem";

const StickyFooterContainer = styled.div`
  width: 100%;
  height: fit-content;
  justify-content: space-between;
  position: sticky;
  bottom: 0;
  display: flex;
  z-index: 100;

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
      <BaseLink
        to="https://github.com/ribbon-finance"
        target="_blank"
        rel="noreferrer noopener"
      >
        <SocialButton>
          <img src={github} alt="github" />
        </SocialButton>
      </BaseLink>
      <BaseLink
        to="https://discord.com/invite/ribbon-finance"
        target="_blank"
        rel="noreferrer noopener"
      >
        <SocialButton>
          <img src={discord} alt="discord" />
        </SocialButton>
      </BaseLink>
      <BaseLink
        to="https://twitter.com/ribbonfinance"
        target="_blank"
        rel="noreferrer noopener"
      >
        <SocialButton>
          <img src={twitter} alt="twitter" />
        </SocialButton>
      </BaseLink>
    </Socials>
  );
};

interface Chain {
  chain: Chains;
  logo: Assets;
  vaults: Array<VaultOptions>;
}

const ChevronContainer = styled.div`
  img {
    &:first-child {
      transform: rotate(180deg);
    }

    &:hover {
      transition: 0.75s;
      filter: brightness(3);
      cursor: pointer;
    }
  }
`;

const chains: Array<Chain> = [
  {
    chain: Chains.Ethereum,
    logo: "WETH",
    vaults: [
      "rETH-THETA",
      "ryvUSDC-ETH-P-THETA",
      "rstETH-THETA",
      "rBTC-THETA",
      "rAAVE-THETA",
      "rUSDC-ETH-P-THETA",
    ],
  },
  {
    chain: Chains.Avalanche,
    logo: "WAVAX",
    vaults: ["rsAVAX-THETA", "rUSDC-AVAX-P-THETA", "rAVAX-THETA"],
  },
  {
    chain: Chains.Solana,
    logo: "SOL",
    vaults: ["rSOL-THETA"],
  },
];

const Chevron: React.FC<{ setChain: () => void }> = ({ setChain }) => (
  <ChevronContainer className="chevron" onClick={() => setChain()}>
    <img src={chevron} alt="chevron" />
  </ChevronContainer>
);

const TVLContainer = styled.div`
  margin-bottom: 24px;
  margin-left: 24px;
  display: flex;
  height: 56px;
  color: ${colors.primaryText};

  > * {
    margin: auto 0;
  }

  ${ChevronContainer} {
    padding-right: 16px;
    margin: auto;
    display: flex;

    &:last-child {
      transform: rotate(180deg);
    }
  }

  @media (max-width: ${sizes.md}px) {
    display: none;
  }
`;

const CurrentTVL = styled.div`
  width: 180px;
  background: rgba(255, 255, 255, 0.04);
  padding: 8px;
  backdrop-filter: blur(40px);
  border-radius: 100px;
  display: flex;

  svg {
    height: 40px;
    width: 40px;
    margin-right: 16px;
  }
`;

const TVLTitle = styled.div`
  color: ${colors.tertiaryText};
  font-size: 10px;
`;

const TVLValue = styled.div`
  font-family: VCR;
  font-size: 14px;
`;

const TVL = () => {
  const [selectedChain, setChain] = useState<Chain>(chains[0]);
  const [chainTVL, setTVL] = useState<string>("0");

  const { data } = useTVL();
  const Logo = getAssetLogo(selectedChain.logo);

  useEffect(() => {
    const selectedVaults = data.filter((tvl) =>
      selectedChain.vaults.includes(tvl.vault.option)
    );

    setTVL(
      formatAmount(selectedVaults.reduce((acc, curr) => acc + curr.tvl, 0))
    );
  }, [data, selectedChain]);

  const onSetChain = (nextChain: boolean = false) => {
    const currentIndex = chains.findIndex(
      (chain) => chain.chain === selectedChain.chain
    );

    if (nextChain) {
      if (currentIndex >= chains.length - 1) {
        setChain(chains[0]);
      } else {
        setChain(chains[currentIndex + 1]);
      }
    } else {
      if (currentIndex <= 0) {
        setChain(chains[chains.length - 1]);
      } else {
        setChain(chains[currentIndex - 1]);
      }
    }
  };

  return (
    <TVLContainer>
      <Chevron setChain={() => onSetChain(false)} />
      <CurrentTVL>
        <Logo showBackground />
        <div>
          <TVLTitle>{READABLE_CHAIN_NAMES[selectedChain.chain]} TVL</TVLTitle>
          <TVLValue>${chainTVL}</TVLValue>
        </div>
      </CurrentTVL>
      <Chevron setChain={() => onSetChain(true)} />
    </TVLContainer>
  );
};

const StickyFooter = () => {
  return (
    <StickyFooterContainer>
      <div>
        <TVL />
      </div>
      <div>
        <Scroller />
      </div>
      <div>
        <SocialMedia />
      </div>
    </StickyFooterContainer>
  );
};

export default StickyFooter;
