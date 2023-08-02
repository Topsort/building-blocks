/* eslint-disable @typescript-eslint/no-unused-vars */
import type {
  CampaignIdsByProductId,
  Campaign,
  DefaultBudgetAndCpc,
  PartialCampaign,
  MarketplaceDetails,
} from "@api/types";

import type { Services } from "./types";

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
const testMultiProductCampaignId = uuidv4();

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
    activeBidsCount: 1,
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
  [testMultiProductCampaignId]: {
    campaignId: testMultiProductCampaignId,
    name: "Autumn Pullie",
    budget: {
      amount: 200,
      type: "daily",
    },
    startDate: "2022-10-08T14:15:22Z",
    endDate: "2022-10-22T14:15:22Z",
    activeBidsCount: 2,
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

async function getMarketplaceDetails(
  authToken: string
): Promise<MarketplaceDetails> {
  return delayedResponse({
    currencyCode: "USD",
    currencyExponent: 2,
    languagePreference: "en",
  });
}

async function getDefaultBudgetAndCpc(
  authToken: string,
  vendorId: string
): Promise<DefaultBudgetAndCpc> {
  return delayedResponse({
    cpc: {
      lowerBound: 1,
      upperBound: 6,
    },
    defaultBudget: 400,
  });
}

async function getCampaignIdsByProductId(
  centralServicesUrl: string,
  authToken: string,
  vendorId: string,
  productIds: string[]
): Promise<CampaignIdsByProductId> {
  const response = productIds.reduce((acc, id) => {
    if (id === "WH10") {
      acc[id] = testCampaignId;
    } else if (id === "WH03") {
      acc[id] = testMultiProductCampaignId;
    } else {
      acc[id] = null;
    }
    return acc;
  }, {} as CampaignIdsByProductId);
  return delayedResponse(response);
}

async function getCampaign(
  authToken: string,
  vendorId: string,
  campaignId: string
): Promise<Campaign> {
  return delayedResponse(testCampaignsById[campaignId]);
}
async function getShopCampaign(
  centralServicesUrl: string,
  authToken: string
): Promise<Campaign | null> {
  return delayedResponse(testCampaignsById[testMultiProductCampaignId]);
}

async function createProductCampaign(
  centralServicesUrl: string,
  authToken: string,
  vendorId: string,
  {
    productId,
    name,
    dailyBudget,
    startDate,
    endDate,
    currencyCode,
  }: {
    productId: string;
    name: string;
    dailyBudget: number;
    startDate: string;
    endDate: string;
    currencyCode: string;
  }
): Promise<Campaign> {
  const response = await delayedResponse({
    name,
    campaignId: uuidv4(),
    budget: {
      type: "daily" as Campaign["budget"]["type"],
      amount: dailyBudget,
    },
    startDate,
    endDate,
  });
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
async function createShopCampaign(
  centralServicesUrl: string,
  authToken: string,
  vendorId: string,
  {
    dailyBudget,
    endDate,
  }: {
    dailyBudget: number;
    endDate: string;
  }
): Promise<void> {
  await delayedResponse({
    name: "",
    campaignId: uuidv4(),
    budget: {
      type: "daily" as Campaign["budget"]["type"],
      amount: dailyBudget,
    },
    startDate: "",
    endDate,
  });
}

async function updateCampaign(
  centralServicesUrl: string,
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
  return await delayedResponse({
    ...testCampaignsById[campaignId],
    ...(name !== undefined && { name }),
    ...(dailyBudget !== undefined && {
      budget: {
        type: "daily" as Campaign["budget"]["type"],
        amount: dailyBudget,
      },
    }),
    ...(startDate !== undefined && { startDate }),
    ...(endDate !== undefined && { endDate }),
  });
}

async function endCampaign(
  authToken: string,
  vendorId: string,
  campaignId: string
): Promise<null> {
  return await delayedResponse(null);
}

export const services: Services = {
  getMarketplaceDetails,
  getDefaultBudgetAndCpc,
  getCampaignIdsByProductId,
  getCampaign,
  createProductCampaign,
  createShopCampaign,
  updateCampaign,
  endCampaign,
  getShopCampaign,
};
