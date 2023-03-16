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

export type PartialCampaign = z.infer<typeof schemas.campaignPartialSchema>;

export type Campaign = z.infer<typeof schemas.campaignSchema>;

export type PaymentMethod = z.infer<typeof schemas.paymentMethodSchema>;

export type ValidationResponse = z.infer<typeof schemas.validationSchema>;
