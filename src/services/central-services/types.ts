import {
  Campaign,
  CampaignIdsByProductId,
  MarketplaceDetails,
  DefaultBudgetAndCpc,
  PartialCampaign,
} from "@api/types";

export type Services = {
  getMarketplaceDetails(
    centralServicesUrl: string,
    authToken: string
  ): Promise<MarketplaceDetails>;
  getDefaultBudgetAndCpc(
    centralServicesUrl: string,
    authToken: string,
    vendorId: string
  ): Promise<DefaultBudgetAndCpc>;
  getCampaignIdsByProductId(
    centralServicesUrl: string,
    authToken: string,
    vendorId: string,
    productIds: string[]
  ): Promise<CampaignIdsByProductId>;
  getCampaign(
    centralServicesUrl: string,
    authToken: string,
    vendorId: string,
    campaignId: string
  ): Promise<Campaign>;
  createCampaign(
    centralServicesUrl: string,
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
    centralServicesUrl: string,
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
    centralServicesUrl: string,
    authToken: string,
    vendorId: string,
    campaignId: string
  ): Promise<null>;
};
