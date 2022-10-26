import moment from "moment";
import { useMemo } from "react";

const useEarnStrategyTime = () => {
  const [strategyStartTime, withdrawalDate, depositWithdrawalDate] =
    useMemo(() => {
      let firstOpenLoanTime = moment.utc("2022-09-02").set("hour", 17);

      let strategyStartTime;

      while (!strategyStartTime) {
        let strategyStartTimeTemp = moment.duration(
          firstOpenLoanTime.diff(moment()),
          "milliseconds"
        );
        if (strategyStartTimeTemp.asMilliseconds() <= 0) {
          firstOpenLoanTime.add(7, "days");
        } else {
          strategyStartTime = strategyStartTimeTemp;
        }
      }

      return [
        `${strategyStartTime.days()}D ${strategyStartTime.hours()}H ${strategyStartTime.minutes()}M`,
        firstOpenLoanTime.format("Do MMM, YYYY"),
        firstOpenLoanTime.add(7, "days").format("Do MMM, YYYY"),
      ];
    }, []);

  return { strategyStartTime, withdrawalDate, depositWithdrawalDate };
};

export default useEarnStrategyTime;
