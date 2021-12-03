import { parseUnits } from "@ethersproject/units";
import moment from "moment";

import { VaultList } from "shared/lib/constants/constants";

const useGovernanceActivity = () => {
  return {
    activities: [...new Array(15)].map((_, index) => {
      const randNum = Math.ceil(Math.random() * 5);

      switch (randNum) {
        case 1:
          // Allocate Vote
          const vaultOption =
            VaultList[Math.floor(Math.random() * VaultList.length)];
          return {
            type: "allocateVote",
            vault: vaultOption,
            amount: parseUnits("2435", 18),
            percentage: 15.3,
            timestamp: moment().subtract(index, "days").unix(),
          };
        case 2:
        case 3:
          return {
            type: randNum === 2 ? "stake" : "unstake",
            amount: parseUnits("5000", 18),
            timestamp: moment().subtract(index, "days").unix(),
          };
        case 4:
          return {
            type: "vote",
            proposal: index,
            timestamp: moment().subtract(index, "days").unix(),
            vote: index % 2 === 0 ? "for" : "against",
          };
        default:
          // Delegate vote
          return {
            type: "delegate",
            address: "0x29Cd242278018b719172e85D79DaB27691d07440",
            timestamp: moment().subtract(index, "days").unix(),
          };
      }
    }),
    loading: false,
  };
};

export default useGovernanceActivity;
