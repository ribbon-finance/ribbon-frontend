import { isProduction } from "./env";

export const addAnalyticsEvent = (
  eventName: string,
  category: string,
  label: string
) => {
  if (!isProduction()) {
    return;
  }

  if (window.gtag) {
    window.gtag("event", eventName, {
      event_category: category,
      event_label: label,
      value: 1,
    });
  }
};

export const addConnectEvent = (label: string, account: string) => {
  const accountStr = account.replace("0x", "");
  addAnalyticsEvent("connectAccount", label, accountStr);
};
