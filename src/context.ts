import { Action, State } from "@state";
import { Currency, CustomText, Style } from "@types";
import { createContext } from "preact";
import { useContext } from "preact/hooks";

type ProductPromotionContextValue = {
  authToken: string;
  vendorId: string;
  language: string;
  currency: Currency;
  formatNumber: Intl.NumberFormat["format"];
  formatMoney: (number: number) => ReturnType<Intl.NumberFormat["format"]>;
  promoteTargetClassName: string;
  style: Style;
  text: CustomText;
  dispatch: (action: Action) => void;
  state: State;
};

export const ProductPromotionContext = createContext<
  ProductPromotionContextValue | undefined
>(undefined);

type UseProductPromotion = () => ProductPromotionContextValue;

export const useProductPromotion: UseProductPromotion = () => {
  const context = useContext(ProductPromotionContext);

  if (context === undefined) {
    throw new Error(
      "ProductPromotionContext must be used within ProductPromotionContext.Provider"
    );
  }

  return context;
};
