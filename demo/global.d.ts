/* eslint-disable no-unused-vars */

type CustomClassName = {
  className: string;
  replace?: boolean;
};

type Style = Partial<
  Record<"button" | "buttonText" | "modal", CustomClassName>
>;

type CustomText = Partial<
  Record<
    "button" | "modalTitle" | "modalSubtitle" | "modalCampaignNamePlaceholder",
    string
  >
>;

type InitParams = {
  apiKey: string;
};

type InitProductPromotion = {
  promoteTargetClassName?: string;
  style?: Style;
  text?: CustomText;
};

interface TopsortElementsI {
  initProductPromotion({
    promoteTargetClassName,
    style,
    text,
  }?: InitProductPromotion): void;
}

declare const TopsortElements: {
  new (params: InitParams): TopsortElementsI;
  promoteTargetClassName: string;
};

export {};
declare global {
  interface Window {
    TopsortElements: typeof TopsortElements;
  }
}
