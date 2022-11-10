import React, { ReactElement, useCallback, useEffect, useState } from "react";
import {
  AccountSummary,
  createOrReturnCode,
  getAccountSummary,
} from "../utils/referrals";
import useWeb3Wallet from "./useWeb3Wallet";

export type ReferralContextType = {
  referralAccountSummary: AccountSummary;
  referralCode: string;
  referralLoading: boolean;
};

const defaultReferralAccountSummary: AccountSummary = {
  address: "---",
  totalReferralRewards: 0,
  userReferred: 0,
  referralCodeUsed: "---",
};

export const defaultReferralData: ReferralContextType = {
  referralAccountSummary: defaultReferralAccountSummary,
  referralCode: "",
  referralLoading: true,
};

export const ReferralContext =
  React.createContext<ReferralContextType>(defaultReferralData);

export const ReferralContextProvider: React.FC<{
  children: ReactElement;
}> = ({ children }) => {
  const [referralAccountSummary, setAccountSummary] = useState(
    defaultReferralAccountSummary
  );
  const [referralCode, setReferralCode] = useState("");
  const [referralLoading, setReferralLoading] = useState(true);
  const { account } = useWeb3Wallet();

  const getAndSetAccountSummary = useCallback(async () => {
    if (account) {
      const data = await getAccountSummary(account);
      setAccountSummary(data);
    } else {
      setAccountSummary(defaultReferralAccountSummary);
    }
  }, [account]);

  const getAndSetReferralCode = useCallback(async () => {
    if (account) {
      const data = await createOrReturnCode(account);
      setReferralCode(data);
    } else {
      setReferralCode("");
    }
  }, [account]);

  useEffect(() => {
    referralAccountSummary !== defaultReferralAccountSummary &&
    referralCode !== ""
      ? setReferralLoading(false)
      : setReferralLoading(true);
  }, [referralAccountSummary, referralCode]);

  useEffect(() => {
    try {
      getAndSetAccountSummary();
      getAndSetReferralCode();
    } catch (err) {
      throw new Error(
        "Error getting and setting account summary or referral code for referrals"
      );
    }
  }, [getAndSetAccountSummary, getAndSetReferralCode]);

  return (
    <ReferralContext.Provider
      value={{
        referralAccountSummary,
        referralCode,
        referralLoading,
      }}
    >
      {children}
    </ReferralContext.Provider>
  );
};
