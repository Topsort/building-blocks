import * as schemas from "@api/schemas";
import { z } from "zod";

export type MarketplaceDetails = z.infer<
  typeof schemas.marketplaceDetailsSchema
>;

export type DefaultBudgetAndCpc = z.infer<
  typeof schemas.defaultBudgetAndCpcSchema
>;
export type CampaignIdsByProductId = z.infer<
  typeof schemas.campaignIdsByProductIdSchema
>;

export type BaseCampaign = z.infer<typeof schemas.campaignBaseSchema>;

export type Campaign = z.infer<typeof schemas.campaignSchema>;

export type CheckVendorCampaign = z.infer<
  typeof schemas.checkVendorCampaignSchema
>;

export type ValidationResponse = z.infer<typeof schemas.validationSchema>;

export type ReportDataWithAuctions = z.infer<
  typeof schemas.reportingApiModels.reportDataWithAuctions
>;
export type DailyReportData = z.infer<
  typeof schemas.reportingApiModels.dailyReportData
>;

export type CampaignWithReport = Campaign & { report: ReportDataWithAuctions };
