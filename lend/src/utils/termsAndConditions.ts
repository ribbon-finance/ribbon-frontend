import { SignatureLike } from "@ethersproject/bytes";
import axios from "axios";
import { PoolOptions } from "shared/lib/constants/lendConstants";
import { TERMS_AND_CONDITIONS_BASE_URL } from "../constants/constants";

export const saveTermsAndConditionsSignature = async (
  signedMessage: SignatureLike,
  pool: PoolOptions,
  message: string
) => {
  const apiURL = `${TERMS_AND_CONDITIONS_BASE_URL}/saveTermsAndConditionsSignature`;
  try {
    const body = { signedMessage: signedMessage, pool: pool, message: message };
    const response = await axios.put(apiURL, body);
    if (!response.data.success) {
      throw new Error(
        `Error adding terms and conditions signature: ${response.data.message}`
      );
    }
  } catch (err) {
    throw new Error(
      `Error while calling backend to add terms and conditions signature: ${err}`
    );
  }
};
