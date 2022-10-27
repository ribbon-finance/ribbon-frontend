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
