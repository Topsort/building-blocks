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

export const reportingApiModels = (function () {
  const events = z.object({
    total: z.number(),
    charged: z.number(),
    adSpent: z.number(),
  });
  const purchases = z.object({
    amount: z.number(),
    count: z.number(),
    quantity: z.number(),
    countByProduct: z.record(z.string(), z.number()).nullable(),
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
  const reportDataWithDate = reportData.extend({ date: z.string() });
  const dailyReportData = z.object({ reports: z.array(reportDataWithDate) });
  return {
    events,
    purchases,
    reportData,
    dailyReportData,
    reportDataWithAuctions,
  };
})();

export const campaignBaseSchema = z.object({
  campaignId: z.string().uuid(),
  name: z.string(),
  budget: z
    .object({
      amount: z.number(),
      type: z.enum(["daily", "weekly", "monthly"]),
    })
    .nullable(),
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
