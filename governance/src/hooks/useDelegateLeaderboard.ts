import { BigNumber } from "@ethersproject/bignumber";
import { parseEther } from "@ethersproject/units";
import { useEffect, useState } from "react";

const useDelegateLeaderboard = () => {
  const [data, setData] = useState<
    Array<{ address: string; votes: BigNumber; weight: number }>
  >([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setData(
      [
        "0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045",
        "0x29Cd242278018b719172e85D79DaB27691d07440",
        "0x9E4011aFC6E5C60344261c5A346dAaA333Fb6436",
        "0x8eCD21bD01628716f30a688eC0772aE76683FB94",
        "0x076786f36CfbFCaA7ad61BD267d419e139b8FC6e",
      ].map((address, index) => ({
        address,
        votes: parseEther("4739233.23").sub(
          parseEther("483389").mul(BigNumber.from(index))
        ),
        weight: (4739233.23 - 483389 * index) / 200000000,
      }))
    );
    setLoading(false);
  }, []);

  return { data, loading };
};

export default useDelegateLeaderboard;
