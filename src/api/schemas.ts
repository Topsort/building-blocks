import { z } from "zod";

export const validateVendorResponseSchema = z.object({
  authToken: z.string(),
});
export type ValidateVendorResponse = z.infer<
  typeof validateVendorResponseSchema
>;

export const vendorCampaignIdsByProductIdResponseSchema = z.record(
  z.string(),
  z.string().nullable()
);
export type VendorCampaignIdsByProductIdResponse = z.infer<
  typeof vendorCampaignIdsByProductIdResponseSchema
>;
