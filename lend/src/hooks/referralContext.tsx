import React, { ReactElement, useCallback, useEffect, useState } from "react";
import {
  AccountSummary,
  createOrReturnCode,
  getAccountSummary,
  getNotifications,
  ReferralNotification,
  setNotifications,
} from "../utils/referrals";
import useWeb3Wallet from "./useWeb3Wallet";

export type ReferralContextType = {
  referralAccountSummary: AccountSummary;
  referralCode: string;
  referralLoading: boolean; // Combination of referral code + account summary
  referralNotifications: Array<ReferralNotification>;
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
  referralNotifications: [],
};

export const ReferralContext =
  React.createContext<ReferralContextType>(defaultReferralData);

const combineReferrerNotifications = (
  referrerNotifications: Array<ReferralNotification>
) => {
  const combinedReferrerNotifications: Array<ReferralNotification> = [];
  if (referrerNotifications.length === 0) {
    return combinedReferrerNotifications;
  }
  let totalAmount = 0;
  for (const referrerNotification of referrerNotifications) {
    totalAmount += referrerNotification.amount;
  }
  const combinedNewNotification: ReferralNotification = {
    recordID: referrerNotifications[0].recordID, // Since unused for rendering, just set to first record's id
    amount: totalAmount,
    type: "Referrer",
  };
  combinedReferrerNotifications.push(combinedNewNotification);
  return combinedReferrerNotifications;
};

const setReferrerNotifications = (
  referrerNotifications: Array<ReferralNotification>
) => {
  const referrerNotificationsRecordIDs: string[] = [];
  // We can only send max 10 records per AirTable update
  if (referrerNotifications.length < 11) {
    for (const referrerNotification of referrerNotifications) {
      referrerNotificationsRecordIDs.push(referrerNotification.recordID);
    }
    setNotifications(referrerNotificationsRecordIDs, "Referrer");
  } else {
    const slicedArray = referrerNotifications.slice(0, 10);
    for (const referrerNotification of slicedArray) {
      referrerNotificationsRecordIDs.push(referrerNotification.recordID);
    }
    setNotifications(referrerNotificationsRecordIDs, "Referrer");
    setReferrerNotifications(referrerNotifications.slice(10));
  }
};

export const ReferralContextProvider: React.FC<{
  children: ReactElement;
}> = ({ children }) => {
  const [referralAccountSummary, setAccountSummary] = useState(
    defaultReferralAccountSummary
  );
  const [referralCode, setReferralCode] = useState("");
  const initialReferralNotificationsState: ReferralNotification[] = [];
  const [referralNotifications, setReferralNotifications] = useState(
    initialReferralNotificationsState
  );
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

  const getAndSetReferralNotifications = useCallback(async () => {
    if (account) {
      const refereeNotifications = await getNotifications(account, "Referee");
      const referrerNotifications = await getNotifications(account, "Referrer");
      const combinedReferrerNotifications = combineReferrerNotifications(
        referrerNotifications
      );
      setReferralNotifications([
        ...refereeNotifications,
        ...combinedReferrerNotifications,
      ]);
      if (refereeNotifications.length > 0) {
        const refereeNotificationsRecordIDs: string[] = [];
        refereeNotificationsRecordIDs.push(refereeNotifications[0].recordID); // Since can only be referee at most once, we can just take first record.
        setNotifications(refereeNotificationsRecordIDs, "Referee");
      }
      if (referrerNotifications.length > 0) {
        setReferrerNotifications(referrerNotifications);
      }
    } else {
      setReferralNotifications([]);
    }
  }, [account]);

  useEffect(() => {
    try {
      getAndSetReferralNotifications();
    } catch (err) {
      throw new Error(
        "Error getting and setting referral notifications for referrals"
      );
    }
  }, [getAndSetReferralNotifications]);

  return (
    <ReferralContext.Provider
      value={{
        referralAccountSummary,
        referralCode,
        referralLoading,
        referralNotifications,
      }}
    >
      {children}
    </ReferralContext.Provider>
  );
};
