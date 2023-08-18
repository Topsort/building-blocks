import { z } from "zod";

export const nullSchema = z.null();

export const marketplaceDetailsSchema = z.object({
  currencyCode: z.string().length(3),
  currencyExponent: z.number().int().min(0).max(4),
  languagePreference: z.string().min(1),
});

export const defaultBudgetAndCpcSchema = z.object({
  cpc: z.object({
    upperBound: z.number().int(),
    lowerBound: z.number().int(),
  }),
  defaultBudget: z.number().int(),
});

export const campaignIdsByProductIdSchema = z.record(
  z.string().min(1),
  z.string().uuid().nullable()
);

export const scrollResponse = z.object({
  hasMore: z.boolean(),
  nextPage: z.string().min(1).nullable(),
});

export const reportingApiModels = (function () {
  const events = z.object({
    total: z.bigint(),
    charged: z.bigint(),
    adSpent: z.bigint(),
  });
  const purchases = z.object({
    amount: z.bigint(),
    count: z.bigint(),
    quantity: z.bigint(),
    countByProduct: z.record(z.string(), z.bigint()),
  });
  const reportData = z.object({
    impressions: events,
    clicks: events,
    purchases,
  });
  const reportDataWithAuctions = reportData.extend({
    auctions: z.object({
      percentageWon: z.number(),
      won: z.number(),
      lost: z.number(),
    }),
  });
  const dailyReportData = reportData.extend({
    date: z.date(),
  });
  const dailyReportResponse = scrollResponse.extend({
    reports: z.array(dailyReportData),
  });
  const baseKPIs = z.object({
    adSpend: z.number().gte(0),
    cpc: z.number().gte(0.0),
    ctr: z.number().gte(0.0),
    conversionRate: z.number().gte(0.0),
    impressions: z.number().gte(0),
    chargedImpressions: z.number().gte(0),
    clicks: z.number().gte(0),
    chargedClicks: z.number().gte(0),
    purchaseCount: z.number().gte(0),
    purchaseRevenue: z.number().gte(0.0),
    roas: z.number().gte(0.0),
  });
  const marketplaceKPIs = baseKPIs.extend({
    activeVendors: z.number().gte(0),
  });
  const reportingDimensions = z.enum([
    "impressions",
    "charged_impressions",
    "clicks",
    "charged_clicks",
    "purchases",
    "purchase_value",
    "adSpend",
    "cpc",
    "ctr",
    "conversion_rate",
    "roas",
    "vendor_id",
    "vendor_name",
    "timegroup",
    "campaign_name",
    "campaign_id",
    "campaign_status",
    "campaign_ad_format",
  ]);

  return {
    events,
    purchases,
    reportData,
    reportDataWithAuctions,
    dailyReportData,
    dailyReportResponse,
    baseKPIs,
    marketplaceKPIs,
    reportingDimensions,
  };
})();

export const campaignBaseSchema = z.object({
  campaignId: z.string().uuid(),
  name: z.string(),
  budget: z.object({
    amount: z.number(),
    type: z.enum(["daily", "weekly", "monthly"]),
  }),
  startDate: z.string(),
  endDate: z.string(),
});

export const campaignSchema = campaignBaseSchema.extend({
  activeBidsCount: z.number().int().min(0).optional(),
});

export const checkVendorCampaignSchema = z.object({
  exists: z.boolean(),
  campaign: campaignBaseSchema.nullable(),
});

export const validationSchema = z.object({
  authToken: z.string(),
  authorized: z.boolean(),
});
