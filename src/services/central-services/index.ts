import { api } from "@api/index";
import paths from "@api/paths";
import * as schemas from "@api/schemas";

function getAuthorizationHeader(apiKey: string) {
  return { authorization: `Bearer ${apiKey}` };
}

export async function validateVendor(
  apiKey: string,
  vendorId: string
): Promise<string> {
  const { authToken } = await api(
    schemas.validateVendorResponseSchema,
    paths.validate(vendorId),
    {
      method: "GET",
      headers: getAuthorizationHeader(apiKey),
    }
  );
  return authToken;
}