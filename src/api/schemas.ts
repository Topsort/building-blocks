import { z } from "zod";

export const validateVendorResponseSchema = z.object({
  authToken: z.string(),
});

export const existingCampaignResponseSchema = z.object({
  campaignId: z.string().nullable(),
  activeBids: z.number().min(0),
});

export type ExistingCampaignResponse = z.infer<
  typeof existingCampaignResponseSchema
>;
