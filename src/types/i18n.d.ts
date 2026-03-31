import "i18next";
import common from "../public/locales/en/common.json";
import editor from "../public/locales/en/editor.json";
import landing from "../public/locales/en/landing.json";

declare module "i18next" {
  interface CustomTypeOptions {
    defaultNS: "common";
    resources: {
      common: typeof common;
      editor: typeof editor;
      landing: typeof landing;
    };
  }
}
