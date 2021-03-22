declare interface Window {
  gtag: (
    event: "event",
    action: string,
    eventOptions: { event_category: string; event_label: string; value: number }
  ) => void;
}
