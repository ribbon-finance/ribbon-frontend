import Airtable from "airtable";

const airtableApiKey = process.env.REACT_APP_AIRTABLE_API_KEY;
let configured = false;

export const hasAirtableConfig = Boolean(airtableApiKey);

export const getAirtableBase = (baseId: string) => {
  if (!airtableApiKey) {
    return undefined;
  }

  if (!configured) {
    Airtable.configure({
      endpointUrl: "https://api.airtable.com",
      apiKey: airtableApiKey,
    });
    configured = true;
  }

  return Airtable.base(baseId);
};
