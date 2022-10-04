import * as schemas from "@api/schemas";
import { z } from "zod";

export type ValidateVendor = z.infer<typeof schemas.validateVendorSchema>;

export type CampaignIdsByProductId = z.infer<
  typeof schemas.campaignIdsByProductIdSchema
>;
