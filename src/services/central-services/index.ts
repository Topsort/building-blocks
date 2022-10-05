import { api } from "@api/index";
import paths from "@api/paths";
import * as schemas from "@api/schemas";
import type {
  CampaignIdsByProductId,
  ValidateVendor,
  PaymentMethod,
  Campaign,
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
  //   setTimeout(
  //     () =>
  //       res({
  //         "product-1": "00000000-0000-7000-8088-0000000002dc",
  //         "product-4": "00000000-0000-7000-8088-0000000001ab",
  //       }),
  //     2000
  //   );
  //   // setTimeout(() => rej("Error!!"), 2000);
  // });
  const a = await api(
    schemas.campaignIdsByProductIdSchema,
    paths.products(vendorId),
    {
      method: "POST",
      headers: getHeaders(authToken),
      body: JSON.stringify(productIds),
    }
  );
  a["product-1"] = "00000000-0000-7000-8088-0000000002dc";
  a["product-4"] = "00000000-0000-7000-8088-0000000001ab";
  return a;
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

const fakeCampaignsById: Record<string, Campaign> = {
  "00000000-0000-7000-8088-0000000002dc": {
    campaignId: "00000000-0000-7000-8088-0000000002dc",
    name: "Fakey McFakerson Campaign",
    budget: {
      amount: 200,
      type: "daily",
    },
    endDate: "2019-08-24T14:15:22Z",
    campaignBehaviorData: {
      clicks: {
        total: 24,
        charged: 24,
        adSpent: 24,
      },
      impressions: {
        total: 1341,
        charged: 1341,
        adSpent: 1341,
      },
      purchases: {
        amount: 19,
        count: 19,
        quantity: 19,
      },
    },
  },
  "00000000-0000-7000-8088-0000000001ab": {
    campaignId: "00000000-0000-7000-8088-0000000001ab",
    name: "Totally A Real Campaign",
    budget: {
      amount: 990,
      type: "daily",
    },
    endDate: "2019-08-24T14:15:22Z",
    campaignBehaviorData: {
      clicks: {
        total: 42,
        charged: 42,
        adSpent: 42,
      },
      impressions: {
        total: 9001,
        charged: 9001,
        adSpent: 9001,
      },
      purchases: {
        amount: 21,
        count: 21,
        quantity: 21,
      },
    },
  },
};

export async function getCampaign(
  authToken: string,
  vendorId: string,
  campaignId: string
): Promise<Campaign> {
  return new Promise((res, rej) => {
    setTimeout(() => res(fakeCampaignsById[campaignId]), 1000);
    // setTimeout(() => rej("Error!!"), 1000);
  });
  return await api(
    schemas.campaignSchema,
    paths.campaign(vendorId, campaignId),
    {
      method: "GET",
      headers: getHeaders(authToken),
    }
  );
}
