import { api } from "@api/index";
import paths from "@api/paths";
import * as schemas from "@api/schemas";

function getAuthorizationHeader(apiKey: string) {
  return { authorization: `Bearer ${apiKey}` };
}

function getAuthTokenHeader(authToken: string) {
  return { authToken: `Bearer ${authToken}` };
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

export async function getExistingCampaignByProductId(
  authToken: string,
  productId: string
): Promise<schemas.ExistingCampaignResponse> {
  const response = await api(
    schemas.existingCampaignResponseSchema,
    paths.existingCampaign(productId),
    {
      method: "GET",
      headers: getAuthTokenHeader(authToken),
    }
  );
  return response;
}
