/* eslint-disable @typescript-eslint/no-unused-vars */
import type {
  CampaignIdsByProductId,
  ValidateVendor,
  PaymentMethod,
  Campaign,
} from "@api/types";
import { PaymentMethod as StripePaymentMethod } from "@stripe/stripe-js";

function uuidv4() {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, (c) =>
    (
      c ^
      (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4)))
    ).toString(16)
  );
}

const testCampaignId = uuidv4();

const testCampaignsById: Record<string, Campaign> = {
  [testCampaignId]: {
    campaignId: testCampaignId,
    name: "Helena Hooded Fleece Campaign",
    budget: {
      amount: 200,
      type: "daily",
    },
    startDate: "2022-10-06T14:15:22Z",
    endDate: "2022-10-24T14:15:22Z",
    campaignBehaviorData: {
      clicks: {
        total: 208,
        charged: 208,
        adSpent: 208,
      },
      impressions: {
        total: 302,
        charged: 76,
        adSpent: 109,
      },
      purchases: {
        amount: 1045,
        count: 19,
        quantity: 19,
      },
    },
  },
};

function delayedResponse<T>(response: T): Promise<T> {
  return new Promise((res) => setTimeout(() => res(response), 1000));
}

export async function validateVendor(
  apiKey: string,
  vendorId: string
): Promise<ValidateVendor> {
  return delayedResponse({
    authToken: "auth-token-123",
  });
}

export async function getCampaignIdsByProductId(
  authToken: string,
  vendorId: string,
  productIds: string[]
): Promise<CampaignIdsByProductId> {
  const response = productIds.reduce((acc, id) => {
    acc[id] = id === "WH10" ? testCampaignId : null;
    return acc;
  }, {} as CampaignIdsByProductId);
  return delayedResponse(response);
}

export async function getPaymentMethods(
  authToken: string
): Promise<PaymentMethod[]> {
  return delayedResponse([]);
}

export async function createPaymentMethod(
  authToken: string,
  paymentMethod: StripePaymentMethod
): Promise<null> {
  return delayedResponse(null);
}

export async function createCampaign(
  authToken: string,
  vendorId: string,
  {
    productId,
    name,
    dailyBudget,
    startDate,
    endDate,
    paymentMethod,
    currencyCode,
  }: {
    productId: string;
    name: string;
    dailyBudget: number;
    startDate: string;
    endDate: string;
    paymentMethod: PaymentMethod;
    currencyCode: string;
  }
): Promise<Campaign> {
  const response = await delayedResponse({
    name,
    campaignId: uuidv4(),
    budget: {
      type: "daily" as Campaign["budget"]["type"],
      amount: dailyBudget * 100,
    },
    startDate,
    endDate,
  });
  return {
    ...response,
    campaignBehaviorData: {
      clicks: {
        total: 0,
        charged: 0,
        adSpent: 0,
      },
      impressions: {
        total: 0,
        charged: 0,
        adSpent: 0,
      },
      purchases: {
        amount: 0,
        count: 0,
        quantity: 0,
      },
    },
  };
}

export async function getCampaign(
  authToken: string,
  vendorId: string,
  campaignId: string
): Promise<Campaign> {
  return delayedResponse(testCampaignsById[campaignId]);
}
