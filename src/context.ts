import { CustomText, Style } from "@types";
import { createContext } from "preact";
import { useContext } from "preact/hooks";

import { Action, initialState, State } from "./state";

type ProductPromotionContextValue = {
  authToken: string;
  vendorId: string;
  promoteTargetClassName: string;
  style: Style;
  text: CustomText;
  dispatch: (action: Action) => void;
  state: State;
};

export const ProductPromotionContext =
  createContext<ProductPromotionContextValue>({
    authToken: "",
    vendorId: "",
    promoteTargetClassName: "",
    style: {},
    text: {},
    dispatch: () => {
      throw new Error(
        "ProductPromotionContext: 'dispatch()' must be used inside functional component only!"
      );
    },
    state: initialState,
  });

type UseProductPromotion = () => ProductPromotionContextValue;

export const useProductPromotion: UseProductPromotion = () =>
  useContext<ProductPromotionContextValue>(ProductPromotionContext);
