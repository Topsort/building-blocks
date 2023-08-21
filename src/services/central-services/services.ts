import { api } from "@api/index";
import { paths } from "@api/paths";
import * as schemas from "@api/schemas";
import { version } from "../../../package.json";

import type {
  CampaignIdsByProductId,
  Campaign,
  CheckVendorCampaign,
  DefaultBudgetAndCpc,
  MarketplaceDetails,
  BaseCampaign,
  ReportDataWithAuctions,
} from "@api/types";

import type { Services } from "./types";

export function getAuthHeaders(extraAuthHeaders?: Record<string, string>) {
  return {
    "Content-Type": "application/json",
    "X-User-Agent": `Topsort-Building-Blocks/${version}`,
    ...extraAuthHeaders,
  };
}

export function getHeaders(token: string) {
  return {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
    "X-User-Agent": `Topsort-Building-Blocks/${version}`,
  };
}

async function getMarketplaceDetails(
  centralServicesUrl: string,
  authToken: string
): Promise<MarketplaceDetails> {
  return await api(
    schemas.marketplaceDetailsSchema,
    paths.marketplaceDetails(centralServicesUrl),
    {
      method: "GET",
      headers: getHeaders(authToken),
    }
  );
}

async function getDefaultBudgetAndCpc(
  centralServicesUrl: string,
  authToken: string,
  vendorId: string
): Promise<DefaultBudgetAndCpc> {
  return await api(
    schemas.defaultBudgetAndCpcSchema,
    paths.defaultBudget(centralServicesUrl, vendorId),
    {
      method: "GET",
      headers: getHeaders(authToken),
    }
  );
}

async function getCampaignIdsByProductId(
  centralServicesUrl: string,
  authToken: string,
  vendorId: string,
  productIds: string[]
): Promise<CampaignIdsByProductId> {
  const response = await api(
    schemas.campaignIdsByProductIdSchema,
    paths.products(centralServicesUrl, vendorId),
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

async function getCampaign(
  centralServicesUrl: string,
  authToken: string,
  vendorId: string,
  campaignId: string
): Promise<Campaign> {
  return await api(
    schemas.campaignSchema,
    paths.campaign(centralServicesUrl, vendorId, campaignId),
    {
      method: "GET",
      headers: getHeaders(authToken),
    }
  );
}

async function getCampaignReport(
  centralServicesUrl: string,
  authToken: string,
  campaignId: string
): Promise<ReportDataWithAuctions> {
  return await api(
    schemas.reportingApiModels.reportDataWithAuctions,
    paths.campaignReport(centralServicesUrl, campaignId),
    {
      method: "GET",
      headers: getHeaders(authToken),
    }
  );
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
  const response = await api(
    schemas.campaignBaseSchema,
    paths.campaigns(centralServicesUrl, vendorId),
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
        currencyCode,
      }),
    }
  );

  // New campaigns don't have behaviour data yet, so add it here
  // filled with zeros for a consistent data format
  return {
    ...response,
    activeBidsCount: 1,
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
  await api(
    schemas.nullSchema,
    paths.promoteMyShop(centralServicesUrl, vendorId),
    {
      method: "POST",
      headers: getHeaders(authToken),
      body: JSON.stringify({
        budgetAmount: dailyBudget,
        endDate,
      }),
    }
  );
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
): Promise<BaseCampaign> {
  return await api(
    schemas.campaignBaseSchema,
    paths.campaign(centralServicesUrl, vendorId, campaignId),
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
  centralServicesUrl: string,
  authToken: string,
  vendorId: string,
  campaignId: string
): Promise<null> {
  return await api(
    schemas.nullSchema,
    paths.campaign(centralServicesUrl, vendorId, campaignId),
    {
      method: "DELETE",
      headers: getHeaders(authToken),
    }
  );
}

async function getShopCampaign(
  centralServicesUrl: string,
  authToken: string
): Promise<CheckVendorCampaign | null> {
  return await api(
    schemas.checkVendorCampaignSchema,
    paths.campaignByShop(centralServicesUrl),
    {
      method: "GET",
      headers: getHeaders(authToken),
    }
  );
}

export const services: Services = {
  getMarketplaceDetails,
  getDefaultBudgetAndCpc,
  getCampaignIdsByProductId,
  getCampaign,
  getCampaignReport,
  createProductCampaign,
  updateCampaign,
  endCampaign,
  getShopCampaign,
  createShopCampaign,
};
