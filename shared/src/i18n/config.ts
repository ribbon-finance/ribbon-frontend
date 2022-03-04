import i18n from "i18next";
import webapp from "./en/webapp.json";
import shared from "./en/shared.json";
import governance from "./en/governance.json";
import { initReactI18next } from "react-i18next";

export const resources = {
  en: {
    webapp,
    shared,
    governance,
  },
} as const;

i18n.use(initReactI18next).init({
  lng: "en",
  interpolation: {
    escapeValue: false, // not needed for react as it escapes by default
  },
  resources,
});
