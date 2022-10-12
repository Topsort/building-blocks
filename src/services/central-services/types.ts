import {
  Campaign,
  CampaignIdsByProductId,
  PartialCampaign,
  PaymentMethod,
  ValidateVendor,
} from "@api/types";
import { PaymentMethod as StripePaymentMethod } from "@stripe/stripe-js";

export type Services = {
  validateVendor(apiKey: string, vendorId: string): Promise<ValidateVendor>;
  getPaymentMethods(authToken: string): Promise<PaymentMethod[]>;
  createPaymentMethod(
    authToken: string,
    paymentMethod: StripePaymentMethod
  ): Promise<null>;
  getCampaignIdsByProductId(
    authToken: string,
    vendorId: string,
    productIds: string[]
  ): Promise<CampaignIdsByProductId>;
  getCampaign(
    authToken: string,
    vendorId: string,
    campaignId: string
  ): Promise<Campaign>;
  createCampaign(
    authToken: string,
    vendorId: string,
    data: {
      productId: string;
      name: string;
      dailyBudget: number;
      startDate: string;
      endDate: string;
      paymentMethod: PaymentMethod;
      currencyCode: string;
    }
  ): Promise<Campaign>;
  updateCampaign(
    authToken: string,
    vendorId: string,
    campaignId: string,
    data: {
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
  ): Promise<PartialCampaign>;
};