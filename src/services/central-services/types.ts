import {
  Campaign,
  CampaignIdsByProductId,
  MarketplaceDetails,
  DefaultBudgetAndCpc,
  CheckVendorCampaign,
  BaseCampaign,
  ReportDataWithAuctions,
  DailyReportData,
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
  getShopCampaign(
    centralServicesUrl: string,
    authToken: string
  ): Promise<CheckVendorCampaign | null>;
  getCampaign(
    centralServicesUrl: string,
    authToken: string,
    vendorId: string,
    campaignId: string
  ): Promise<Campaign>;
  getCampaignReport(
    centralServicesUrl: string,
    authToken: string,
    campaignId: string
  ): Promise<ReportDataWithAuctions>;
  getCampaignDailyReport(
    centralServicesUrl: string,
    authToken: string,
    campaignId: string,
    startDate?: Date,
    endDate?: Date
  ): Promise<DailyReportData>;
  createProductCampaign(
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
  createShopCampaign(
    centralServicesUrl: string,
    authToken: string,
    vendorId: string,
    data: {
      dailyBudget: number;
      endDate: string;
    }
  ): Promise<void>;
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
  ): Promise<BaseCampaign>;
  endCampaign(
    centralServicesUrl: string,
    authToken: string,
    vendorId: string,
    campaignId: string
  ): Promise<null>;
};
