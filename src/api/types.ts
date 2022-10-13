import * as schemas from "@api/schemas";
import { z } from "zod";

export type ValidateVendor = z.infer<typeof schemas.validateVendorSchema>;

export type DefaultBudgetAndCpc = z.infer<
  typeof schemas.defaultBudgetAndCpcSchema
>;
export type CampaignIdsByProductId = z.infer<
  typeof schemas.campaignIdsByProductIdSchema
>;

export type PartialCampaign = z.infer<typeof schemas.campaignPartialSchema>;

export type Campaign = z.infer<typeof schemas.campaignSchema>;

export type PaymentMethod = z.infer<typeof schemas.paymentMethodSchema>;
