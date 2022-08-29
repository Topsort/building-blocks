import { z } from "zod";

export const validateVendorResponseSchema = z.object({
  authToken: z.string(),
});
