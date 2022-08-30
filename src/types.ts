export type Style = {
  button?: {
    borderRadius: "none" | "sm" | "full";
  };
};

export type CustomText = Partial<
  Record<
    | "button"
    | "modalTitle"
    | "modalSubtitle"
    | "modalCampaignNamePlaceholder"
    | "detailButton",
    string
  >
>;

export type Campaign = {
  budget: number;
  name: string;
  productImageUrl: string;
  totalSpend: string;
  totalSales: string;
  roas: string;
  days: number;
  minRoas: string;
  impressions: number;
  clicks: number;
  purchases: number;
  status: boolean;
};
