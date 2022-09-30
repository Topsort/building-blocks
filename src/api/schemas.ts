import { z } from "zod";

export const validateVendorSchema = z.object({
  authToken: z.string(),
});
export type ValidateVendor = z.infer<typeof validateVendorSchema>;

export const campaignIdsByProductIdSchema = z.record(
  z.string(),
  z.string().nullable()
);
export type CampaignIdsByProductId = z.infer<
  typeof campaignIdsByProductIdSchema
>;
