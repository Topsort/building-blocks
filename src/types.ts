export type Style = {
  button?: {
    borderRadius: "none" | "sm" | "full";
  };
};

export type CustomText = Partial<
  Record<
    "button" | "modalTitle" | "modalSubtitle" | "modalCampaignNamePlaceholder",
    string
  >
>;
