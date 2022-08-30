import { CustomText, Style } from "@types";
import { createContext } from "preact";
import { useContext } from "preact/hooks";

type ProductPromotionContextValue = {
  promoteTargetClassName: string;
  style: Style;
  text: CustomText;
};

export const ProductPromotionContext =
  createContext<ProductPromotionContextValue>({
    promoteTargetClassName: "",
    style: {},
    text: {},
  });

type UseProductPromotion = () => ProductPromotionContextValue;

export const useProductPromotion: UseProductPromotion = () =>
  useContext<ProductPromotionContextValue>(ProductPromotionContext);
