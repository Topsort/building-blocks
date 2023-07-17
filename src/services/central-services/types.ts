import {
  Campaign,
  CampaignIdsByProductId,
  MarketplaceDetails,
  DefaultBudgetAndCpc,
  PartialCampaign,
} from "@api/types";

export type Services = {
  getMarketplaceDetails(authToken: string): Promise<MarketplaceDetails>;
  getDefaultBudgetAndCpc(
    authToken: string,
    vendorId: string
  ): Promise<DefaultBudgetAndCpc>;
  getCampaignIdsByProductId(
    authToken: string,
    vendorId: string,
    productIds: string[]
  ): Promise<CampaignIdsByProductId>;
  getCampaign(
    authToken: string,
    vendorId: string,
    campaignId: string
  ): Promise<Campaign>;
  createCampaign(
    authToken: string,
    vendorId: string,
    data: {
      productId: string;
      name: string;
      dailyBudget: number;
      startDate: string;
      endDate: string;
      currencyCode: string;
    }
  ): Promise<Campaign>;
  updateCampaign(
    authToken: string,
    vendorId: string,
    campaignId: string,
    data: {
      name?: string;
      dailyBudget?: number;
      startDate?: string;
      endDate?: string;
      isActive?: boolean;
      isSmart?: boolean;
      campaignType?: "manual" | "autobidding";
      status?: "approved" | "pending" | "rejected" | "terminated";
      statusUpdatedBy?: string;
    }
  ): Promise<PartialCampaign>;
  endCampaign(
    authToken: string,
    vendorId: string,
    campaignId: string
  ): Promise<null>;
};
