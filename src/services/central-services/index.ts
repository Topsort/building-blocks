import { api } from "@api/index";
import paths from "@api/paths";
import * as schemas from "@api/schemas";
import type {
  CampaignIdsByProductId,
  ValidateVendor,
  PaymentMethod,
} from "@api/types";
import { PaymentMethod as StripePaymentMethod } from "@stripe/stripe-js";

function getHeaders(token: string) {
  return {
    authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };
}

export async function validateVendor(
  apiKey: string,
  vendorId: string
): Promise<ValidateVendor> {
  return await api(schemas.validateVendorSchema, paths.validate(vendorId), {
    method: "GET",
    headers: getHeaders(apiKey),
  });
}

export async function getCampaignIdsByProductId(
  authToken: string,
  vendorId: string,
  productIds: string[]
): Promise<CampaignIdsByProductId> {
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
      headers: getHeaders(authToken),
      body: JSON.stringify(productIds),
    }
  );
}

export async function getPaymentMethods(
  authToken: string
): Promise<PaymentMethod[]> {
  const { methods } = await api(
    schemas.paymentMethodsSchema,
    paths.paymentMethods(),
    {
      method: "GET",
      headers: getHeaders(authToken),
    }
  );

  return methods;
}

export async function createPaymentMethod(
  authToken: string,
  paymentMethod: StripePaymentMethod
): Promise<null> {
  return await api(schemas.nullSchema, paths.paymentMethods(), {
    method: "POST",
    headers: getHeaders(authToken),
    body: JSON.stringify({
      data: {
        id: paymentMethod.id,
        provider: "stripe",
        data: {
          id: paymentMethod.id,
          type: paymentMethod.type,
        },
      },
    }),
  });
}
