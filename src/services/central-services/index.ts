import paths from "@api/paths";
import * as schemas from "@api/schemas";
import { enhancedApi } from "src/api";

export const validateApiKey = async (
  apiKey: string,
  vendorId: string
): Promise<string> => {
  const { authToken } = await enhancedApi(
    schemas.validateApiKeyResponseSchema,
    paths.validate(vendorId),
    {
      method: "GET",
      headers: { apiKey },
    }
  );
  return authToken;
};
