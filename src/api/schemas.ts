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

const cardDataSchema = z.object({
  id: z.string().min(1),
  type: z.literal("card"),
  brand: z.string().min(1),
  last4: z.string().length(4),
});

const topsortBalanceDataSchema = z.object({
  id: z.string().min(1),
  type: z.literal("balance"),
});

export const paymentMethodSchema = z.object({
  id: z.string().min(1),
  provider: z.string().min(1),
  data: z.union([cardDataSchema, topsortBalanceDataSchema]),
});

export const paymentMethodsSchema = z.object({
  methods: z.array(paymentMethodSchema),
});

export const campaignPartialSchema = z.object({
  campaignId: z.string().uuid(),
  name: z.string(),
  budget: z.object({
    amount: z.number(),
    type: z.enum(["daily", "weekly", "monthly"]),
  }),
  startDate: z.string(),
  endDate: z.string(),
});

export const campaignSchema = campaignPartialSchema.extend({
  activeBidsCount: z.number().int().min(0),
  campaignBehaviorData: z.object({
    clicks: z.object({
      total: z.number().min(0),
      charged: z.number().min(0),
      adSpent: z.number().min(0),
    }),
    impressions: z.object({
      total: z.number().min(0),
      charged: z.number().min(0),
      adSpent: z.number().min(0),
    }),
    purchases: z.object({
      amount: z.number().min(0),
      count: z.number().min(0),
      quantity: z.number().min(0),
    }),
  }),
});

export const validationSchema = z.object({
  authToken: z.string(),
  authorized: z.boolean(),
});
