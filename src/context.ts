import { Action, State } from "@state";
import { Currency, CustomText, Style } from "@types";
import { createContext } from "preact";
import { useContext } from "preact/hooks";

type PromotionContextValue = {
  centralServicesUrl: string;
  authToken: string;
  vendorId: string;
  language: string;
  currency: Currency;
  formatNumber: Intl.NumberFormat["format"];
  formatMoney: (number: number) => ReturnType<Intl.NumberFormat["format"]>;
  promoteTargetClassName: string;
  promoteShopClassName: string;
  isUsingProductPromotion: boolean;
  isUsingShopPromotion: boolean;
  style: Style;
  text: CustomText;
  counter: number;
  dispatch: (action: Action) => void;
  state: State;
};

export const PromotionContext = createContext<
  PromotionContextValue | undefined
>(undefined);

type UsePromotionContext = () => PromotionContextValue;

export const usePromotionContext: UsePromotionContext = () => {
  const context = useContext(PromotionContext);

  if (context === undefined) {
    throw new Error(
      "ProductPromotionContext must be used within ProductPromotionContext.Provider"
    );
  }

  return context;
};
