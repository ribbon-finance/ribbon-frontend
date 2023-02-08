import Airtable from "airtable";
import { useEffect, useMemo, useState } from "react";
import { VaultOptions } from "../constants/constants";
import useWeb3Wallet from "./useWeb3Wallet";

export type VIP = {
  loading: boolean;
  username: string;
  vaultOptions: VaultOptions[];
  passcodeHash: string;
};

export const defaultVIP: VIP = {
  loading: true,
  username: "",
  vaultOptions: [],
  passcodeHash: "",
};

// maps the vip to the data of each vip
export type VIPMap = {
  [userAddress: string]: VIP;
};

export interface AirtableValues {
  userAddress: string;
  username: string;
  vaultOptions: string;
  passcodeHash: string;
}

const airtableValueArray = [
  "userAddress",
  "username",
  "vaultOptions",
  "passcodeHash",
];

Airtable.configure({
  endpointUrl: "https://api.airtable.com",
  apiKey: process.env.REACT_APP_AIRTABLE_API_KEY,
});

const baseName = "VIP";

const base = Airtable.base("appkUHzxJ1lehQTIt");

const recordHasUndefined = (recordTemp: any): boolean => {
  for (const key in airtableValueArray) {
    if (recordTemp.fields[airtableValueArray[key]] === undefined) {
      return true;
    }
  }
  return false;
};

export const useAirtableVIPData = () => {
  const [values, setValues] = useState<AirtableValues[]>();
  const [, setError] = useState<string>();
  const [loading, setLoading] = useState<boolean>(true);
  const { account } = useWeb3Wallet();
  useEffect(() => {
    // 1. When init load schedules
    base(baseName)
      .select({ view: "Grid view" })
      .all()
      .then((records) => {
        // check for undefined rows in airtable
        const filteredRecords = records.filter(
          (record) => !recordHasUndefined(record)
        );
        const airtableFields = filteredRecords.map(
          (record) => record.fields as unknown as AirtableValues
        );
        setValues(airtableFields);
      })
      .catch((e) => {
        setError("ERROR FETCHING");
      });
  }, []);

  const [vipMap, isVIPAddress] = useMemo(() => {
    if (!values) {
      return [{ "0x01": defaultVIP } as VIPMap, false];
    }

    setLoading(false);

    return [
      Object.fromEntries(
        values.map((value) => {
          return [
            value.userAddress,
            {
              loading: false,
              username: value.username,
              passcodeHash: value.passcodeHash,
              vaultOptions: JSON.parse(value.vaultOptions) as VaultOptions[],
            },
          ];
        })
      ) as VIPMap,
      account
        ? values.some(function (obj) {
            return obj.userAddress === account;
          })
        : false,
    ];
  }, [account, values]);

  // gets all vaults that vip has access to
  const allUserVaults = (): VaultOptions[] => {
    const auth = localStorage.getItem("auth");
    if (loading || !auth) {
      return [];
    }
    return JSON.parse(auth).reduce(
      (allVaultOptions: VaultOptions[], userAddress: string) => {
        const userVaults = vipMap[userAddress].vaultOptions;
        for (const vaultOption of userVaults) {
          if (!allVaultOptions.includes(vaultOption)) {
            allVaultOptions.push(vaultOption);
          }
        }
        return allVaultOptions;
      },
      []
    );
  };

  if (loading || !values) {
    //placeholder values while values are loading
    return {
      loading,
      vipMap: { "0x01": defaultVIP } as VIPMap,
      allUserVaults,
      isVIPAddress,
    };
  }

  return {
    loading,
    vipMap,
    allUserVaults,
    isVIPAddress,
  };
};
