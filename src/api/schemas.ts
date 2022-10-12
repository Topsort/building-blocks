import { z } from "zod";

export const nullSchema = z.null();

export const validateVendorSchema = z.object({
  authToken: z.string().min(1),
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

export const paymentMethodSchema = z.object({
  id: z.string().min(1),
  provider: z.string().min(1),
  data: z.object({
    id: z.string().min(1),
    type: z.string().min(1),
    brand: z.string().min(1),
    last4: z.string().length(4),
  }),
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
