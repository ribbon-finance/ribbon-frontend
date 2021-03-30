export const addAnalyticsEvent = (
  eventName: string,
  category: string,
  label: string
) => {
  if (!process.env.REACT_APP_GOOGLE_ANALYTICS_TRACKING_ID) {
    return;
  }
};

export const addConnectEvent = (label: string, account: string) => {
  account = account.replace("0x", "");
  addAnalyticsEvent("connectAccount", label, account);
};
