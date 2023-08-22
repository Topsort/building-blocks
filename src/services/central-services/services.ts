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
  return await api({
    schema: schemas.marketplaceDetailsSchema,
    url: paths.marketplaceDetails(centralServicesUrl),
    config: {
      method: "GET",
      headers: getHeaders(authToken),
    },
  });
}

async function getDefaultBudgetAndCpc(
  centralServicesUrl: string,
  authToken: string,
  vendorId: string
): Promise<DefaultBudgetAndCpc> {
  return await api({
    schema: schemas.defaultBudgetAndCpcSchema,
    url: paths.defaultBudget(centralServicesUrl, vendorId),
    config: {
      method: "GET",
      headers: getHeaders(authToken),
    },
  });
}

async function getCampaignIdsByProductId(
  centralServicesUrl: string,
  authToken: string,
  vendorId: string,
  productIds: string[]
): Promise<CampaignIdsByProductId> {
  const response = await api({
    schema: schemas.campaignIdsByProductIdSchema,
    url: paths.products(centralServicesUrl, vendorId),
    config: {
      method: "POST",
      headers: getHeaders(authToken),
      body: JSON.stringify(productIds),
    },
  });
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
  return await api({
    schema: schemas.campaignSchema,
    url: paths.campaign(centralServicesUrl, vendorId, campaignId),
    config: {
      method: "GET",
      headers: getHeaders(authToken),
    },
  });
}

async function getCampaignReport(
  centralServicesUrl: string,
  authToken: string,
  campaignId: string,
  startDate?: Date,
  endDate?: Date
): Promise<ReportDataWithAuctions> {
  const requestEndDate = endDate ?? new Date();
  const dateOffset = 24 * 60 * 60 * 1000 * 8;
  const requestStartDate =
    startDate ?? new Date(requestEndDate.getTime() - dateOffset);

  const urlSearchParamas = new URLSearchParams({
    start_date: requestStartDate.toISOString().split("T")[0],
    end_date: requestEndDate.toISOString().split("T")[0],
  });
  return await api({
    schema: schemas.reportingApiModels.reportDataWithAuctions,
    url: paths.campaignReport(centralServicesUrl, campaignId),
    urlSearchParamas,
    config: {
      method: "GET",
      headers: getHeaders(authToken),
    },
  });
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
  const response = await api({
    schema: schemas.campaignBaseSchema,
    url: paths.campaigns(centralServicesUrl, vendorId),
    config: {
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
    },
  });

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
  await api({
    schema: schemas.nullSchema,
    url: paths.promoteMyShop(centralServicesUrl, vendorId),
    config: {
      method: "POST",
      headers: getHeaders(authToken),
      body: JSON.stringify({
        budgetAmount: dailyBudget,
        endDate,
      }),
    },
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
): Promise<BaseCampaign> {
  return await api({
    schema: schemas.campaignBaseSchema,
    url: paths.campaign(centralServicesUrl, vendorId, campaignId),
    config: {
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
    },
  });
}

async function endCampaign(
  centralServicesUrl: string,
  authToken: string,
  vendorId: string,
  campaignId: string
): Promise<null> {
  return await api({
    schema: schemas.nullSchema,
    url: paths.campaign(centralServicesUrl, vendorId, campaignId),
    config: {
      method: "DELETE",
      headers: getHeaders(authToken),
    },
  });
}

async function getShopCampaign(
  centralServicesUrl: string,
  authToken: string
): Promise<CheckVendorCampaign | null> {
  return await api({
    schema: schemas.checkVendorCampaignSchema,
    url: paths.campaignByShop(centralServicesUrl),
    config: {
      method: "GET",
      headers: getHeaders(authToken),
    },
  });
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
