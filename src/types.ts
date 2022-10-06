import { ComponentChildren } from "preact";

declare global {
  const CENTRAL_SERVICES_BASE_URL: string;
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

export type PropsWithChildren<T> = T & { children?: ComponentChildren };

export type RequestStatus = "idle" | "pending" | "success" | "error";
