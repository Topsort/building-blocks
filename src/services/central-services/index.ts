import { enhancedApi } from "@api/index";
import paths from "@api/paths";
import * as schemas from "@api/schemas";

function getAuthorizationHeader(apiKey: string) {
  return { authorization: `Bearer ${apiKey}` };
}

export async function validateApiKey(
  apiKey: string,
  vendorId: string
): Promise<string> {
  const { authToken } = await enhancedApi(
    schemas.validateApiKeyResponseSchema,
    paths.validate(vendorId),
    {
      method: "GET",
      headers: getAuthorizationHeader(apiKey),
    }
  );
  return authToken;
}
