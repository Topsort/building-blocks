export type Style = Partial<{
  button: {
    borderRadius: "none" | "sm" | "full";
  };
}>;

export type CustomText = Partial<
  Record<
    "button" | "modalTitle" | "modalSubtitle" | "modalCampaignNamePlaceholder",
    string
  >
>;
