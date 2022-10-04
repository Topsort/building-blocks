import { z } from "zod";

export const validateVendorSchema = z.object({
  authToken: z.string(),
});

export const campaignIdsByProductIdSchema = z.record(
  z.string(),
  z.string().nullable()
);
