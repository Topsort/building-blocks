export type ApiKey = string;

type CustomClassName = {
  className: string;
  replace?: boolean;
};

export type Style = Partial<
  Record<"button" | "buttonText" | "modal", CustomClassName>
>;

export type CustomText = Partial<
  Record<
    "button" | "modalTitle" | "modalSubtitle" | "modalCampaignNamePlaceholder",
    string
  >
>;
