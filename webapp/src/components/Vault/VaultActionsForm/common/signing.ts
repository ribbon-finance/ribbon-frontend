/* eslint-disable prefer-destructuring */
/* eslint-disable no-bitwise */
import { ethers, providers } from "ethers";
import { BytesLike } from "ethers";

export type ISignatureLike = {
    r: string;
    s?: string;
    _vs?: string;
    recoveryParam?: number;
    v?: number;
} | BytesLike;

export interface ISignature {
    r: string;

    s: string;
    _vs: string;

    recoveryParam: number;
    v: number;

    yParityAndS: string;
    compact: string;
}
export const domainType = [
  { name: "name", type: "string" },
  { name: "version", type: "string" },
  { name: "chainId", type: "uint256" },
];

// The first signature required to use the random private key
const signingKeyType = [{ name: "account", type: "address" }];

interface ISigningKeyMessage {
  account: string;
}

const registerType = [
  { name: "key", type: "address" },
  { name: "expiry", type: "uint256" },
];

interface IRegisterMessage {
  key: string;
  expiry: string;
}

interface IAuthInfo {
  // Private key
  signingKey: string;
  apiKey: string;
}

type LocalStorageAuthInfo = {
  // Wallet connected
  [address: string]: IAuthInfo;
};


export function splitSignature(signature: ISignatureLike): ISignature {
  const {
    isBytesLike,
    arrayify,
    hexlify,
    zeroPad,
    isHexString,
    hexZeroPad,
  } = ethers.utils;

  const result: any = {
    r: "0x",
    s: "0x",
    _vs: "0x",
    recoveryParam: 0,
    v: 0,
    yParityAndS: "0x",
    compact: "0x",
  };

  if (isBytesLike(signature)) {
    const bytes: Uint8Array = arrayify(signature);

    // Get the r, s and v
    if (bytes.length === 64) {
      // EIP-2098; pull the v from the top bit of s and clear it
      result.v = 27 + (bytes[32] >> 7);
      bytes[32] &= 0x7f;

      result.r = hexlify(bytes.slice(0, 32));
      result.s = hexlify(bytes.slice(32, 64));
    } else if (bytes.length === 65) {
      result.r = hexlify(bytes.slice(0, 32));
      result.s = hexlify(bytes.slice(32, 64));
      result.v = bytes[64];
    } else {
      throw Error("invalid signature string");
    }

    // Allow a recid to be used as the v
    if (result.v < 27) {
      if (result.v === 0 || result.v === 1) {
        result.v += 27;
      } else {
        throw Error("signature invalid v byte");
      }
    }

    // Compute recoveryParam from v
    result.recoveryParam = 1 - (result.v % 2);

    // Compute _vs from recoveryParam and s
    if (result.recoveryParam) {
      bytes[32] |= 0x80;
    }
    result._vs = hexlify(bytes.slice(32, 64));
  } else {
    result.r = signature.r;
    result.s = signature.s;
    result.v = signature.v;
    result.recoveryParam = signature.recoveryParam;
    result._vs = signature._vs;

    // If the _vs is available, use it to populate missing s, v and recoveryParam
    // and verify non-missing s, v and recoveryParam
    if (result._vs != null) {
      const vs = zeroPad(arrayify(result._vs), 32);
      result._vs = hexlify(vs);

      // Set or check the recid
      const recoveryParam = vs[0] >= 128 ? 1 : 0;
      if (result.recoveryParam == null) {
        result.recoveryParam = recoveryParam;
      } else if (result.recoveryParam !== recoveryParam) {
        throw Error("signature recoveryParam mismatch _vs");
      }

      // Set or check the s
      vs[0] &= 0x7f;
      const s = hexlify(vs);
      if (result.s == null) {
        result.s = s;
      } else if (result.s !== s) {
        throw Error("signature v mismatch _vs");
      }
    }

    // Use recid and v to populate each other
    console.log({ result });
    if (result.recoveryParam == null) {
      if (result.v == null) {
        throw Error("signature missing v and recoveryParam");
      } else if (result.v === 0 || result.v === 1) {
        result.recoveryParam = result.v;
      } else {
        result.recoveryParam = 1 - (result.v % 2);
      }
    } else if (result.v == null) {
      result.v = 27 + result.recoveryParam;
    } else {
      const recId
        = result.v === 0 || result.v === 1 ? result.v : 1 - (result.v % 2);
      if (result.recoveryParam !== recId) {
        throw Error("signature recoveryParam mismatch v");
      }
    }

    if (result.r == null || !isHexString(result.r)) {
      throw Error("signature missing or invalid r");
    } else {
      result.r = hexZeroPad(result.r, 32);
    }

    if (result.s == null || !isHexString(result.s)) {
      throw Error("signature missing or invalid s");
    } else {
      result.s = hexZeroPad(result.s, 32);
    }

    const vs = arrayify(result.s);
    if (vs[0] >= 128) {
      throw Error("signature s out of range");
    }
    if (result.recoveryParam) {
      vs[0] |= 0x80;
    }
    const _vs = hexlify(vs);

    if (result._vs) {
      if (!isHexString(result._vs)) {
        throw Error("signature invalid _vs");
      }
      result._vs = hexZeroPad(result._vs, 32);
    }

    // Set or check the _vs
    if (result._vs == null) {
      result._vs = _vs;
    } else if (result._vs !== _vs) {
      throw Error("signature _vs mismatch v and s");
    }
  }

  result.yParityAndS = result._vs;
  result.compact = result.r + result.yParityAndS.substring(2);

  return result;
}