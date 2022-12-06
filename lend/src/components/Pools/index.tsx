import { getAssetLogo } from "../../utils/asset";
import {
  getAssets,
  getMakerLogo,
  PoolDetailsMap,
} from "../../constants/constants";
import { PoolList } from "shared/lib/constants/lendConstants";
import { usePoolsData } from "../../hooks/web3DataContext";
import { formatBigNumber } from "shared/lib/utils/math";
import { getAssetDecimals, getUtilizationDecimals } from "../../utils/asset";
import styled, { keyframes } from "styled-components";
import { BaseButton, Subtitle, Title } from "../../designSystem";
import { fadeIn } from "shared/lib/designSystem/keyframes";
import { motion } from "framer-motion";
import { Row } from "react-bootstrap";
import colors from "shared/lib/designSystem/colors";
import { usePoolsApr } from "../../hooks/usePoolsApr";
import { Link } from "react-router-dom";
import { isPracticallyZero } from "shared/lib/utils/math";
import usePoolAccounts from "../../hooks/usePoolAccounts";
import { formatUnits } from "ethers/lib/utils";
import sizes from "../../designSystem/sizes";
import { delayedFade } from "../animations";
import currency from "currency.js";
import useWeb3Wallet from "../../hooks/useWeb3Wallet";
import { useMemo } from "react";
import useLoadingText from "shared/lib/hooks/useLoadingText";
import { useCredoraData } from "shared/lib/hooks/useCredoraData";
import AssetArray from "../Common/AssetArray";

const statSideContainer: number = 120;

const ListRow = styled(Row)`
  display: block;
  padding: 0;
  @media (max-width: ${sizes.md}px) {
    border-top: 1px solid ${colors.border};
  }
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
  border-radius: 0;
  border-left: 1px solid ${colors.border};
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

const PoolWrapper = styled(Link)`
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

  @media (max-width: ${sizes.md}px) {
    padding: 16px;
  }

  > ${Stat}:last-of-type {
    > * {
      display: flex;
      justify-content: flex-end;
    }
  }
`;

const Value = styled.span`
  display: flex;
  font-family: VCR;
  color: ${colors.primaryText};
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
  const poolDatas = usePoolsData();
  const utilizationDecimals = getUtilizationDecimals();
  const { loading, aprs } = usePoolsApr();
  const { account } = useWeb3Wallet();
  const AssetLogo = getAssetLogo("USDC");
  const { data: credoraData, loading: credoraLoading } = useCredoraData();
  const loadingText = useLoadingText();
  const [filteredList, isManager] = useMemo(() => {
    if (!account) {
      return [PoolList, false];
    }
    let managers: string[] = [];
    PoolList.forEach((p) => {
      managers.push(poolDatas.data[p].manager);
    });
    if (!managers.includes(account)) {
      return [PoolList, false];
    }
    return [
      PoolList.filter((pool) => poolDatas.data[pool].manager === account),
      true,
    ];
  }, [account, poolDatas.data]);

  return (
    <ListRow>
      {filteredList.map((pool, i) => {
        const poolSize = poolDatas.data[pool].poolSize;
        const utilizationRate = poolDatas.data[pool].utilizationRate;
        const totalBorrowed = poolDatas.data[pool].borrows;
        const rating = credoraData[pool].creditScoreRating;
        const poolLogo = getMakerLogo(pool);
        const asset = getAssets(pool);
        const decimals = getAssetDecimals(asset);
        const apr = aprs[pool].toFixed(2);
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
            <PoolWrapper key={i} to={`/app/pool/${pool.toLowerCase()}`}>
              <PoolLogo>
                <img src={poolLogo} alt={pool} />
              </PoolLogo>
              <PoolStats>
                <Stat>
                  <StyledTitle>{PoolDetailsMap[pool].name}</StyledTitle>
                  <StyledSubtitle>
                    {credoraLoading
                      ? loadingText
                      : `Rating ${rating} - Utilization
                    ${formatBigNumber(utilizationRate, utilizationDecimals)}%`}
                  </StyledSubtitle>
                </Stat>
                <Stat>
                  <Value>
                    <AssetArray />
                    <StyledTitle>
                      <span>
                        {currency(
                          formatUnits(
                            !isManager ? poolSize : totalBorrowed,
                            decimals
                          ),
                          {
                            symbol: "",
                          }
                        ).format()}
                      </span>
                    </StyledTitle>
                  </Value>
                  <StyledSubtitle
                    color={
                      loading || parseFloat(apr) === 0
                        ? colors.primaryText
                        : colors.green
                    }
                  >
                    {loading
                      ? loadingText
                      : `${currency(apr, {
                          symbol: "",
                        }).format()}% APR`}
                  </StyledSubtitle>
                </Stat>
              </PoolStats>
              <PoolButton>
                <i className="fas fa-arrow-right" />
              </PoolButton>
            </PoolWrapper>
          </motion.div>
        );
      })}
    </ListRow>
  );
};

const NoPositionsContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  height: 100%;

  @media (max-width: ${sizes.md}px) {
    height: fit-content;
  }
`;

const NoPositionLabel = styled.span<{ delay: number; duration: number }>`
  color: ${colors.tertiaryText};
  font-size: 14px;

  ${delayedFade}
`;

export const Positions = () => {
  const poolDatas = usePoolsData();
  const usdcDecimals = getAssetDecimals("USDC");
  const { account, active } = useWeb3Wallet();
  const { loading: poolLoading, poolAccounts } = usePoolAccounts("lend");
  const filteredList = useMemo(() => {
    if (!poolAccounts || poolLoading || !account) {
      return [];
    }
    return PoolList.filter(
      (pool) =>
        !isPracticallyZero(
          poolDatas.data[pool].poolBalanceInAsset,
          usdcDecimals
        )
    );
  }, [account, usdcDecimals, poolAccounts, poolDatas.data, poolLoading]);

  if (!poolAccounts) {
    return <></>;
  }

  return filteredList.length > 0 ? (
    <ListRow>
      {filteredList.map((pool, i) => {
        const balance = poolDatas.data[pool].poolBalanceInAsset;
        const poolAccount = poolAccounts[pool];

        const profit = () => {
          if (
            !poolAccount ||
            poolLoading ||
            isPracticallyZero(poolAccount.totalDeposits, usdcDecimals)
          ) {
            return 0;
          }

          return parseFloat(
            formatUnits(balance.sub(poolAccount.totalDeposits), usdcDecimals)
          );
        };

        const roi = () => {
          if (
            !poolAccount ||
            poolLoading ||
            isPracticallyZero(poolAccount.totalDeposits, usdcDecimals)
          ) {
            return 0;
          }

          return (
            (parseFloat(
              formatUnits(balance.sub(poolAccount.totalDeposits), usdcDecimals)
            ) /
              parseFloat(
                formatUnits(poolAccount.totalDeposits, usdcDecimals)
              )) *
            100
          );
        };

        const roiColor = () => {
          return roi() === 0
            ? colors.primaryText
            : roi() >= 0
            ? colors.green
            : colors.red;
        };

        const poolLogo = getMakerLogo(pool);
        const asset = getAssets(pool);
        const decimals = getAssetDecimals(asset);
        const AssetLogo = getAssetLogo(asset);

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
            <PoolWrapper key={i} to={`/app/pool/${pool.toLowerCase()}`}>
              <PoolLogo>
                <img src={poolLogo} alt={pool} />
              </PoolLogo>
              <PoolStats>
                <Stat>
                  <StyledTitle>{pool}</StyledTitle>
                </Stat>
                <Stat>
                  <Value>
                    <AssetLogo />
                    <StyledTitle>
                      <span>
                        {currency(formatUnits(balance, decimals), {
                          symbol: "",
                        }).format()}
                      </span>
                    </StyledTitle>
                  </Value>
                  <StyledSubtitle color={roiColor()}>
                    {poolLoading || !account
                      ? "---"
                      : `${roi() > 0 ? "+" : ""}${currency(
                          profit().toFixed(2),
                          {
                            symbol: "",
                          }
                        ).format()} (${roi().toFixed(2)}%)`}
                  </StyledSubtitle>
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
  ) : (
    <NoPositionsContainer>
      <NoPositionLabel delay={0.1} duration={0.5}>
        {account && active
          ? "You do not have any positions at the moment"
          : "Please connect your wallet to view your positions"}
      </NoPositionLabel>
    </NoPositionsContainer>
  );
};
