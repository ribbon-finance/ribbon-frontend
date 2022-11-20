import axios from "axios";
import { REFERRALS_API_BASE_URL } from "../constants/constants";

export const getAddressFromCode = async (referralCode: string) => {
  const apiURL = `${REFERRALS_API_BASE_URL}/getAddressFromCode?code=${referralCode}`;
  try {
    const response = await axios.get(apiURL);
    if (response.data.success) {
      return response.data.data["address"];
    } else {
      throw new Error("Error getting address from code provided");
    }
  } catch (err) {
    throw new Error("Error while calling backend to get address from code");
  }
};

export interface AccountSummary {
  address: string;
  totalReferralRewards: number;
  userReferred: number;
  referralCodeUsed: string;
}

export const getAccountSummary = async (
  userAddress: string
): Promise<AccountSummary> => {
  const apiURL = `${REFERRALS_API_BASE_URL}/getAccountSummary?address=${userAddress}`;
  try {
    const response = await axios.get(apiURL);
    if (response.data.success) {
      const summary: AccountSummary = {
        address: response.data.data["address"],
        totalReferralRewards: response.data.data["totalReferralRewards"],
        userReferred: response.data.data["usersReferred"],
        referralCodeUsed: response.data.data["referralCodeUsed"],
      };
      return summary;
    } else {
      // Doesn't exist yet in the summary table
      const summary: AccountSummary = {
        address: userAddress,
        totalReferralRewards: 0,
        userReferred: 0,
        referralCodeUsed: "---",
      };
      return summary;
    }
  } catch (err) {
    throw new Error("Error while calling backend to get account summary");
  }
};

export const createOrReturnCode = async (address: string) => {
  const apiURL = `${REFERRALS_API_BASE_URL}/createOrReturnCode?address=${address}`;
  try {
    const response = await axios.get(apiURL);
    if (response.data.success) {
      return response.data.data["referralCode"];
    } else {
      throw new Error(
        "Error getting or creating referral code from address provided"
      );
    }
  } catch (err) {
    throw new Error(
      "Error while calling backend to get or create referral code from address"
    );
  }
};

export type ReferralNotification = {
  recordID: string;
  amount: number;
  type: "Referee" | "Referrer";
};

export const getNotifications = async (
  address: string,
  type: "Referee" | "Referrer"
): Promise<ReferralNotification[]> => {
  const apiURL = `${REFERRALS_API_BASE_URL}/getNotifications?address=${address}&type=${type}`;
  try {
    const response = await axios.get(apiURL);
    if (response.data.success) {
      return response.data.data;
    } else {
      throw new Error(
        `Error getting notifications for address provided: ${response.data.message}`
      );
    }
  } catch (err) {
    throw new Error(
      "Error while calling backend to get notifications for address"
    );
  }
};

export const setNotifications = async (
  recordIDs: string[],
  type: "Referee" | "Referrer"
) => {
  if (recordIDs.length > 10) {
    throw new Error(
      "Provided recordIDs cannot be more than size 10. Please break into multiple requests."
    );
  }
  const apiURL = `${REFERRALS_API_BASE_URL}/setNotifications?type=${type}`;
  try {
    const body = { recordIDs: recordIDs };
    const response = await axios.put(apiURL, body);
    if (!response.data.success) {
      throw new Error(
        `Error setting notifications for address provided: ${response.data.message}`
      );
    }
  } catch (err) {
    throw new Error(
      "Error while calling backend to set notifications for address"
    );
  }
};
