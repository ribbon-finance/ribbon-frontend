export const addAnalyticsEvent = (
  eventName: string,
  category: string,
  label: string
) => {
  if (!process.env.REACT_APP_GOOGLE_ANALYTICS_TRACKING_ID) {
    return;
  }

  window.gtag("event", eventName, {
    event_category: category,
    event_label: label,
    value: 1,
  });
};

export const addConnectEvent = (label: string, account: string) => {
  account = account.replace("0x", "");
  addAnalyticsEvent("connectAccount", label, account);
};
