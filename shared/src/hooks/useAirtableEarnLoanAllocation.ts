import Airtable, { Record, FieldSet } from "airtable";
import { useEffect, useMemo, useState } from "react";

import { PoolOptions } from "../constants/lendConstants";
import { PoolList } from "../constants/lendConstants";
export type EarnLoanAllocationResponse = {
  [pool in PoolOptions]: number;
};

export type EarnLoanAllocationData = {
  responses: EarnLoanAllocationResponse;
  loading: boolean;
};

export const defaultEarnLoanAllocationData: EarnLoanAllocationData = {
  responses: Object.fromEntries(
    PoolList.map((pool) => [pool, 0])
  ) as EarnLoanAllocationResponse,
  loading: true,
};
export const defaultEarnLoanAllocation = Object.fromEntries(
  PoolList.map((pool) => [pool, { pool: 0 }])
);

const airtableValueArray = ["loanAllocation"];

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

const BASE_NAME = "EarnLoanAllocation";

const base = Airtable.base("appkUHzxJ1lehQTIt");

export const useAirtableEarnLoanAllocation = () => {
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

  const earnLoanAllocationData = useMemo(() => {
    if (!records) {
      return defaultEarnLoanAllocationData;
    }

    const responses = Object.fromEntries(
      PoolList.map((pool) => {
        const record = records.find((record) => record.fields.pool === pool);

        if (!record) {
          return [pool, 0];
        }

        return [pool, record!.fields.loanAllocation];
      })
    ) as EarnLoanAllocationResponse;

    return {
      responses: responses,
      loading: false,
    };
  }, [records]);

  return {
    records: !records ? defaultEarnLoanAllocationData : earnLoanAllocationData,
  };
};
