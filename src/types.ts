import { MarketplaceDetails } from "@api/types";
import { ComponentChildren } from "preact";
import { z } from "zod";

declare global {
  const AUTH_BASE_URL: string;
  const CENTRAL_SERVICES_BASE_URL: string;
  const USE_MOCK_SERVER: string;
}

export type DocumentStyleProperty =
  | "--ts-primary-rgb"
  | "--ts-secondary-rgb"
  | "--ts-font-rgb";

export type CustomText = Partial<
  Record<"promoteButton" | "detailButton", string>
>;

export type PropsWithChildren<T> = T & { children?: ComponentChildren };

export type RequestStatus = "idle" | "pending" | "success" | "error";

export type Currency = {
  code: MarketplaceDetails["currencyCode"];
  divisor: number;
  exponent: MarketplaceDetails["currencyExponent"];
  decimalSeparator?: string;
  groupSeparator?: string;
  symbol: string;
  isSymbolAtStart: boolean;
};

const rgbSchema = z.union([
  z.string(),
  z.tuple([z.number(), z.number(), z.number()]),
]);

export type Rgb = z.infer<typeof rgbSchema>;

const borderRadiusSchema = z.enum(["none", "sm", "full"]);

export type ButtonSizes = z.infer<typeof borderRadiusSchema>;

const styleSchema = z.object({
  primaryColorRgb: rgbSchema.optional(),
  secondaryColorRgb: rgbSchema.optional(),
  fontColorRgb: rgbSchema.optional(),
  button: z
    .object({
      borderRadius: borderRadiusSchema,
    })
    .optional(),
});

export type Style = z.infer<typeof styleSchema>;

export const initialParamsSchema = z.object({
  centralServicesUrl: z.string().default("https://api.topsort.com"),
  authUrl: z.string(),
  bearerToken: z.string().optional(),
  externalVendorId: z.string(),
  promoteTargetClassName: z.string().optional(),
  style: styleSchema.optional(),
  text: z
    .object({
      promoteButton: z.string().default("Promote"),
      detailButton: z.string().default("See Campaign"),
    })
    .optional(),
});

export type InitParams = z.infer<typeof initialParamsSchema>;
