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
): Promise<schemas.ValidateVendor> {
  return await api(schemas.validateVendorSchema, paths.validate(vendorId), {
    method: "GET",
    headers: getAuthorizationHeader(apiKey),
  });
}

export async function getCampaignIdsByProductId(
  authToken: string,
  vendorId: string,
  productIds: string[]
): Promise<schemas.CampaignIdsByProductId> {
  /*
   * TODO(christopherbot) uncomment this to test a "success" or "failure"
   * of this endpoint since it's not merged yet in Central Services. Will
   * remove this code when the CS work is merged.
   */
  // return new Promise((res, rej) => {
  //   setTimeout(() => res({ "product-1": "campaign-id" }), 2000);
  //   // setTimeout(() => rej("Error!!"), 2000);
  // });
  return await api(
    schemas.campaignIdsByProductIdSchema,
    paths.products(vendorId),
    {
      method: "POST",
      headers: getAuthTokenHeader(authToken),
      body: JSON.stringify({ productIds }),
    }
  );
}
