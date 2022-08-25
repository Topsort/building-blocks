import { z } from "zod";

export const validateApiKeyResponseSchema = z.object({
  authToken: z.string(),
});
