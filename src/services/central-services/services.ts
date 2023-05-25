import { api } from "@api/index";
import { paths } from "@api/paths";
import * as schemas from "@api/schemas";
import type {
  CampaignIdsByProductId,
  PaymentMethod,
  Campaign,
  DefaultBudgetAndCpc,
  PartialCampaign,
  MarketplaceDetails,
} from "@api/types";

import type { Services } from "./types";

export function getHeaders(token: string) {
  return {
    authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };
}

async function getMarketplaceDetails(
  authToken: string
): Promise<MarketplaceDetails> {
  return await api(
    schemas.marketplaceDetailsSchema,
    paths.marketplaceDetails(),
    {
      method: "GET",
      headers: getHeaders(authToken),
    }
  );
}

async function getDefaultBudgetAndCpc(
  authToken: string,
  vendorId: string
): Promise<DefaultBudgetAndCpc> {
  return await api(
    schemas.defaultBudgetAndCpcSchema,
    paths.defaultBudget(vendorId),
    {
      method: "GET",
      headers: getHeaders(authToken),
    }
  );
}

async function getCampaignIdsByProductId(
  authToken: string,
  vendorId: string,
  productIds: string[]
): Promise<CampaignIdsByProductId> {
  const response = await api(
    schemas.campaignIdsByProductIdSchema,
    paths.products(vendorId),
    {
      method: "POST",
      headers: getHeaders(authToken),
      body: JSON.stringify(productIds),
    }
  );
  // TODO(christopherbot) remove this temp code eventually
  // a real campaignId that belongs to Balboa
  response["product-1"] = "e86a2438-14cb-44b1-94a8-291a4a57215b";
  // a campaignId that will result in an error when fetching the campaign
  response["product-4"] = "00000000-0000-7000-8088-0000000001ab";
  return response;
}

// TODO(christopherbot) remove this eventually
// eslint-disable-next-line
const fakeCampaignsById: Record<string, Campaign> = {
  "00000000-0000-7000-8088-0000000001ab": {
    campaignId: "00000000-0000-7000-8088-0000000001ab",
    name: "Fakey McFakerson Campaign",
    budget: {
      amount: 200,
      type: "daily",
    },
    startDate: "2019-08-22T14:15:22Z",
    endDate: "2019-08-24T14:15:22Z",
    activeBidsCount: 1,
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
  "e86a2438-14cb-44b1-94a8-291a4a57215b": {
    campaignId: "e86a2438-14cb-44b1-94a8-291a4a57215b",
    name: "Totally A Real Campaign",
    budget: {
      amount: 990,
      type: "daily",
    },
    startDate: "2019-08-11T14:15:22Z",
    endDate: "2019-08-24T20:54:10Z",
    activeBidsCount: 1,
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

async function getCampaign(
  authToken: string,
  vendorId: string,
  campaignId: string
): Promise<Campaign> {
  // return new Promise((res, rej) => {
  //   setTimeout(() => res(fakeCampaignsById[campaignId]), 1000);
  //   // setTimeout(() => rej("Error!!"), 1000);
  // });
  return await api(
    schemas.campaignSchema,
    paths.campaign(vendorId, campaignId),
    {
      method: "GET",
      headers: getHeaders(authToken),
    }
  );
}

async function createCampaign(
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
  const response = await api(
    schemas.campaignPartialSchema,
    paths.campaigns(vendorId),
    {
      method: "POST",
      headers: getHeaders(authToken),
      body: JSON.stringify({
        name,
        budget: {
          amount: dailyBudget,
          type: "daily",
        },
        startDate,
        endDate,
        isActive: true,
        campaignType: "autobidding",
        promotionType: {
          adFormat: "listing",
        },
        bids: [
          {
            amount: dailyBudget,
            target: {
              id: productId,
              type: "product",
            },
            trigger: {
              type: "product",
              value: {
                productId,
              },
            },
          },
        ],
        paymentMethod,
        currencyCode,
      }),
    }
  );

  // New campaigns don't have behaviour data yet, so add it here
  // filled with zeros for a consistent data format
  return {
    ...response,
    activeBidsCount: 1,
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

async function updateCampaign(
  authToken: string,
  vendorId: string,
  campaignId: string,
  {
    name,
    dailyBudget,
    startDate,
    endDate,
    isActive,
    isSmart,
    campaignType,
    status,
    statusUpdatedBy,
  }: {
    name?: string;
    dailyBudget?: number;
    startDate?: string;
    endDate?: string;
    isActive?: boolean;
    isSmart?: boolean;
    campaignType?: "manual" | "autobidding";
    status?: "approved" | "pending" | "rejected" | "terminated";
    statusUpdatedBy?: string;
  }
): Promise<PartialCampaign> {
  return await api(
    schemas.campaignPartialSchema,
    paths.campaign(vendorId, campaignId),
    {
      method: "PATCH",
      headers: getHeaders(authToken),
      body: JSON.stringify({
        name,
        budget: {
          amount: dailyBudget,
          type: "daily",
        },
        startDate,
        endDate,
        isActive,
        isSmart,
        campaignType,
        status,
        statusUpdatedBy,
      }),
    }
  );
}

async function endCampaign(
  authToken: string,
  vendorId: string,
  campaignId: string
): Promise<null> {
  return await api(schemas.nullSchema, paths.campaign(vendorId, campaignId), {
    method: "DELETE",
    headers: getHeaders(authToken),
  });
}

export const services: Services = {
  getMarketplaceDetails,
  getDefaultBudgetAndCpc,
  getCampaignIdsByProductId,
  getCampaign,
  createCampaign,
  updateCampaign,
  endCampaign,
};
