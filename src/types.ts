import { ComponentChildren } from "preact";

declare global {
  const CENTRAL_SERVICES_PUBLIC_URL: string;
  const CENTRAL_SERVICES_URL: string;
  const STRIPE_PUBLIC_KEY: string;
}

export type DocumentStyleProperty = "--ts-primary-rgb" | "--ts-font-rgb";

export type Rgb = string | [number, number, number];

export type Style = {
  primaryColorRgb?: Rgb;
  fontColorRgb?: Rgb;
  button?: {
    borderRadius: "none" | "sm" | "full";
  };
};

export type CustomText = Partial<
  Record<"promoteButton" | "detailButton", string>
>;

export type Campaign = {
  budget: number;
  name: string;
  productImageUrl: string;
  totalSpend: string;
  totalSales: string;
  roas: string;
  days: number;
  minRoas: string;
  impressions: number;
  clicks: number;
  purchases: number;
  status: boolean;
};

export type PropsWithChildren<T> = T & { children?: ComponentChildren };

export type RequestStatus = "idle" | "pending" | "success" | "error";
