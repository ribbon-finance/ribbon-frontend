import { getMakerLogo } from "../../constants/constants";
import { getAssetLogo } from "shared/lib/utils/asset";
import { getAssets } from "../../constants/constants";
import { VaultList } from "../../constants/constants";
import { useVaultsData } from "../../hooks/web3DataContext";
import { formatBigNumber } from "../../utils/math";
import { getAssetDecimals, getUtilizationDecimals } from "../../utils/asset";
import styled, { keyframes } from "styled-components";
import { BaseButton, Subtitle, Title } from "../../designSystem";
import { fadeIn } from "shared/lib/designSystem/keyframes";
import { motion } from "framer-motion";
import { Row } from "react-bootstrap";
import colors from "shared/lib/designSystem/colors";

const statSideContainer: number = 120;

const ListRow = styled(Row)`
  display: block;
  padding: 0;
`;

const PoolLogo = styled.div`
  width: ${statSideContainer}px;
  height: ${statSideContainer}px;
  border-right: 1px solid ${colors.border};
  display: inline-flex;

  > * {
    overflow: hidden;
  }

  img {
    margin: auto;
  }
`;

const PoolButton = styled(BaseButton)`
  opacity: 0;
  width: 0;
  padding: 0;

  > * {
    overflow: hidden;
  }

  i {
    text-align: center;
    margin: auto;
    width: 24px;
    height: 24px;
    color: white;
  }
`;

const slide = keyframes`
  0% {
    opacity: 1;
    width: ${statSideContainer}px;
  } 

  50% {
    opacity: 0;
  }

  100% {
    width: 0;
    opacity: 0;
  }
`;

const reverseSlide = keyframes`
  0% {
    width: 0;
  } 

  100% {
    width: ${statSideContainer}px;
    opacity: 1;
  }
`;

const PoolWrapper = styled.div`
  height: ${statSideContainer}px;
  width: 100%;
  border-bottom: 1px solid ${colors.border};
  display: flex;

  &:hover {
    transition: 0.25s;
    background: ${colors.background.two};

    ${PoolLogo} {
      animation: 0.5s ${slide} forwards;
    }

    ${PoolButton} {
      animation: 0.5s ${reverseSlide} forwards;
      width: ${statSideContainer}px;
      height: ${statSideContainer}px;
    }
  }

  &:not(:hover) {
    ${PoolLogo} {
      animation: 0.5s ${reverseSlide} forwards;

      > img {
        animation: 0.5s ${fadeIn};
      }
    }

    ${PoolButton} {
      transition: 0.5s ease-in-out;
      animation: 0.5s ${slide};
    }
  }
`;

const Stat = styled.div`
  margin: auto 0;
  height: fit-content;

  > * {
    display: flex;
  }
`;

const PoolStats = styled.div`
  height: ${statSideContainer}px;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  width: calc(100% - ${statSideContainer}px);
  padding: 16px 32px;

  > ${Stat}:last-of-type {
    > * {
      display: flex;
      justify-content: flex-end;
    }
  }
`;

const StyledTitle = styled(Title)`
  font-size: 14px;
  line-height: 36px;

  svg {
    width: fit-content;
    height: fit-content;
    margin: auto;
    margin-right: 8px;
  }
`;

const StyledSubtitle = styled(Subtitle)<{ color?: string }>`
  font-size: 12px;
  line-height: 16px;
  text-transform: uppercase;
  color: ${({ color }) => color ?? colors.tertiaryText};
`;

export const Pools = () => {
  const vaultDatas = useVaultsData();
  const utilizationDecimals = getUtilizationDecimals();

  return (
    <ListRow>
      {VaultList.map((pool, i) => {
        const deposits = vaultDatas.data[pool].deposits;
        const utilizationRate = vaultDatas.data[pool].utilizationRate;
        const poolLogo = getMakerLogo(pool);
        const asset = getAssets(pool);
        const decimals = getAssetDecimals(asset);
        const Logo = getAssetLogo(asset);
        return (
          <motion.div
            key={i}
            transition={{
              duration: 0.5,
              delay: (i + 1) / 10,
              type: "keyframes",
              ease: "easeInOut",
            }}
            initial={{
              y: 50,
              opacity: 0,
            }}
            animate={{
              y: 0,
              opacity: 1,
            }}
            exit={{
              y: 50,
              opacity: 0,
            }}
          >
            <PoolWrapper key={i}>
              <PoolLogo>
                <img src={poolLogo} alt={pool} />
              </PoolLogo>
              <PoolStats>
                <Stat>
                  <StyledTitle>{pool}</StyledTitle>
                  <StyledSubtitle>
                    Utilization{" "}
                    {formatBigNumber(utilizationRate, utilizationDecimals)}%
                  </StyledSubtitle>
                </Stat>
                <Stat>
                  <StyledTitle>
                    <Logo height={24} />
                    <span>{formatBigNumber(deposits, decimals)}</span>
                  </StyledTitle>
                  <StyledSubtitle color={colors.green}>12.55%</StyledSubtitle>
                </Stat>
              </PoolStats>
              <PoolButton>
                <i className="fas fa-chevron-right" />
              </PoolButton>
            </PoolWrapper>
          </motion.div>
        );
      })}
    </ListRow>
  );
};
