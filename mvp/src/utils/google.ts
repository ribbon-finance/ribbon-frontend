export const addAnalyticsEvent = (
  eventName: string,
  category: string,
  label: string,
  value: string
) => {
  window.gtag("event", eventName, {
    event_category: category,
    event_label: label,
    value,
  });
};

export const addConnectEvent = (label: string, account: string) => {
  addAnalyticsEvent("connectAccount", "account", label, account);
};
