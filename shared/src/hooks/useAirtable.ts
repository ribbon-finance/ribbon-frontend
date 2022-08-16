import Airtable from "airtable";
import { FieldSet } from "airtable/lib/field_set";
import Record from "airtable/lib/record";
import dotenv from "dotenv";
import { useEffect, useState } from "react";
import { collapseTextChangeRangesAcrossMultipleVersions } from "typescript";
// import { ScheduleItem } from "./types";

export interface ScheduleItem {
  strikePrice: number;
  baseYield: number;
  maxYield: number;
}

dotenv.config();

Airtable.configure({
  endpointUrl: "https://api.airtable.com",
  apiKey: process.env.REACT_APP_AIRTABLE_API_KEY,
});

const BASE_NAME = "Earn";

const base = Airtable.base("appkUHzxJ1lehQTIt");

export const useAirtable = () => {
  const [schedules, setSchedule] = useState<ScheduleItem[]>();
  const [error, setError] = useState<string>();

  useEffect(() => {
    // 1. When init load schedules
    base(BASE_NAME)
      .select({ view: "Grid view" })
      .all()
      .then((records) => {
        const s: ScheduleItem[] = [];
        records.forEach((record) => {
          const fields = record.fields as unknown;
          const item = fields as ScheduleItem;
          s.push(item);
        });
        setSchedule(s);
      })
      .catch((e) => {
        setSchedule([]);
        setError("ERROR FETCHING");
      });
  }, []);

  return {
    loading: !schedules,
    schedules,
  };
};

// const { loading, schedules } = useAirtable();

export const getAuctionSchedule = async () => {
  const base = Airtable.base("appkUHzxJ1lehQTIt");

  const schedule: ScheduleItem[] = [];

  await base(BASE_NAME)
    .select({ view: "Grid view" })
    .eachPage(async (records, fetchNextPage) => {
      records.forEach((record) => {
        const fields = record.fields as unknown;
        const item = fields as ScheduleItem;
        schedule.push(item);
      });

      fetchNextPage();
    });

  return schedule;
};

// export const getAuctionSchedule = async () => {
//   const base = Airtable.base("appkUHzxJ1lehQTIt");

//   //   const schedule: ScheduleItem[] = [];
//   let strikePrice = 0;
//   let values: AirtableValues = {
//     strikePrice: 0,
//     baseYield: 0,
//     maxYield: 0,
//   };
//   await base(BASE_NAME)
//     .select({ view: "Grid view" })
//     .eachPage(async (records, fetchNextPage) => {
//       const fields = records.at(-1)?.fields as unknown;
//       values = fields as AirtableValues;
//     });

//   return values;
//   //   return schedule;
// };
