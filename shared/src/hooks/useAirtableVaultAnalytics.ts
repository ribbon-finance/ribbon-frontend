import Airtable, { Record, FieldSet } from "airtable";
import { useEffect, useMemo, useState } from "react";
import { VaultList, VaultOptions } from "../constants/constants";

export type VaultAnalyticsResponses = {
  [vault in VaultOptions]: {
    hitRatio: number;
    averageLoss: number;
  };
};

export type VaultAnalyticsData = {
  responses: VaultAnalyticsResponses;
  loading: boolean;
};

export const defaultVaultAnalyticsData: VaultAnalyticsData = {
  responses: Object.fromEntries(
    VaultList.map((vault) => [
      vault,
      {
        hitRatio: 0,
        averageLoss: 0,
      },
    ])
  ) as VaultAnalyticsResponses,
  loading: true,
};

const airtableValueArray = ["hitRatio", "averageLoss"];

const recordHasUndefined = (recordTemp: any): boolean => {
  for (const key in airtableValueArray) {
    if (recordTemp.fields[airtableValueArray[key]] === undefined) {
      return true;
    }
  }
  return false;
};

Airtable.configure({
  endpointUrl: "https://api.airtable.com",
  apiKey: process.env.REACT_APP_AIRTABLE_API_KEY,
});

const BASE_NAME = "Analytics";

const base = Airtable.base("app21SlIS88M8IjHj");

export const useAirtableVaultAnalytics = () => {
  const [records, setRecords] = useState<Record<FieldSet>[]>();
  const [, setError] = useState<string>();

  useEffect(() => {
    // 1. When init load schedules
    base(BASE_NAME)
      .select({ view: "Grid view" })
      .all()
      .then((records) => {
        // check for undefined rows in airtable
        const filteredRecords = records.filter(
          (record) => !recordHasUndefined(record)
        );
        setRecords(filteredRecords);
      })
      .catch((e) => {
        setError("ERROR FETCHING");
      });
  }, []);

  const hitRatioData = useMemo(() => {
    if (!records) {
      return defaultVaultAnalyticsData;
    }

    const responses = Object.fromEntries(
      VaultList.map((vault) => {
        const record = records.find((record) => record.fields.vault === vault);

        if (!record) {
          return [
            vault,
            {
              hitRatio: 0,
              averageLoss: 0,
            },
          ];
        }

        return [
          vault,
          {
            hitRatio: record!.fields.hitRatio,
            averageLoss: record!.fields.averageLoss,
          },
        ];
      })
    ) as VaultAnalyticsResponses;

    return {
      responses: responses,
      loading: false,
    };
  }, [records]);

  return {
    records: !records ? defaultVaultAnalyticsData : hitRatioData,
  };
};
