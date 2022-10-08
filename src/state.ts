import { Campaign, PaymentMethod } from "@api/types";
import { produce } from "immer";

// TODO(samet) recommendedBudget and estimatedClick will change.
export const recommendedBudgetUSD = 5;
export const minBudgetUSD = Math.floor(
  recommendedBudgetUSD - 1 - recommendedBudgetUSD * 0.25
);
export const maxBudgetUSD = Math.ceil(
  recommendedBudgetUSD + 1 + recommendedBudgetUSD * 0.25
);
export const initialDurationDays = 15;
export const minDurationDays = 1;
export const maxDurationDays = 30;
export const minEstimatedClick = 1000;
export const maxEstimatedClick = 1500;

type CampaignCreationStep =
  | "budget and duration"
  | "add payment"
  | "confirm"
  | "launched";

type CampaignDetailsStep = "details" | "editing" | "ending" | "ended";

type ProductData = {
  id: string;
  name: string;
  imgUrl: string;
};

export type State = {
  productDataById: Record<string, ProductData>;
  isModalOpen: boolean;
  isCloseButtonHidden: boolean;
  campaignIdsByProductId: Record<string, string | null>;
  campaignsById: Record<string, Campaign>;
  selectedProductId: string | null;
  paymentMethods: PaymentMethod[];
  selectedPaymentMethodId: PaymentMethod["id"] | null;
  campaignCreation: {
    step: CampaignCreationStep;
    dailyBudget: number;
    durationDays: number;
  };
  campaignDetails: {
    step: CampaignDetailsStep;
  };
};

export const initialState: State = {
  productDataById: {},
  isModalOpen: false,
  isCloseButtonHidden: false,
  campaignIdsByProductId: {},
  campaignsById: {},
  selectedProductId: null,
  paymentMethods: [],
  selectedPaymentMethodId: null,
  campaignCreation: {
    step: "budget and duration",
    dailyBudget: 0,
    durationDays: 0,
  },
  campaignDetails: {
    step: "details",
  },
};

export type Action =
  | {
      type:
        | "modal close button clicked"
        | "budget and duration next button clicked"
        | "payment form back button clicked"
        | "add new payment method button clicked"
        | "confirm campaign creation back button clicked"
        | "campaign creation reset"
        | "edit campaign button clicked"
        | "edit campaign back button clicked"
        | "edit campaign save button clicked"
        | "edit campaign end button clicked"
        | "end campaign button clicked"
        | "end campaign back button clicked"
        | "campaign details reset";
    }
  | {
      type: "promote targets retrieved";
      payload: {
        productDataById: Record<string, ProductData>;
      };
    }
  | {
      type: "campaign ids by product id retrieved";
      payload: {
        campaignIdsByProductId: Record<string, string | null>;
      };
    }
  | {
      type: "product selected";
      payload: {
        productId: string;
      };
    }
  | {
      type: "campaign retrieved";
      payload: {
        campaign: Campaign;
      };
    }
  | {
      type: "payment methods received";
      payload: {
        paymentMethods: PaymentMethod[];
      };
    }
  | {
      type: "payment method saved";
      payload: {
        paymentMethod: PaymentMethod;
      };
    }
  | {
      type: "payment method selected";
      payload: {
        paymentMethod: PaymentMethod;
      };
    }
  | {
      type: "campaign creation daily budget updated";
      payload: {
        amount: number;
      };
    }
  | {
      type: "campaign creation duration updated";
      payload: {
        days: number;
      };
    }
  | {
      type: "campaign launched";
      payload: {
        campaign: Campaign;
        productId: string;
      };
    };

export const reducer = (
  state: Readonly<State>,
  action: Readonly<Action>
): State => {
  return produce(state, (draft) => {
    switch (action.type) {
      case "promote targets retrieved": {
        Object.assign(draft.productDataById, action.payload.productDataById);
        break;
      }
      case "modal close button clicked": {
        draft.isModalOpen = false;
        draft.isCloseButtonHidden = false;
        draft.selectedProductId = null;
        break;
      }
      case "campaign ids by product id retrieved": {
        draft.campaignIdsByProductId = action.payload.campaignIdsByProductId;
        break;
      }
      case "product selected": {
        draft.selectedProductId = action.payload.productId;
        draft.isModalOpen = true;
        draft.isCloseButtonHidden = false;
        break;
      }
      case "campaign retrieved": {
        const { campaign } = action.payload;
        draft.campaignsById[campaign.campaignId] = campaign;
        break;
      }
      case "campaign creation daily budget updated": {
        draft.campaignCreation.dailyBudget = action.payload.amount;
        break;
      }
      case "campaign creation duration updated": {
        draft.campaignCreation.durationDays = action.payload.days;
        break;
      }
      case "budget and duration next button clicked": {
        draft.campaignCreation.step = state.paymentMethods.length
          ? "confirm"
          : "add payment";
        break;
      }
      case "payment form back button clicked": {
        draft.campaignCreation.step = state.paymentMethods.length
          ? "confirm"
          : "budget and duration";
        break;
      }
      case "payment methods received": {
        draft.paymentMethods = action.payload.paymentMethods;
        draft.selectedPaymentMethodId =
          state.selectedPaymentMethodId ||
          action.payload.paymentMethods[0]?.id ||
          null;
        break;
      }
      case "payment method saved": {
        const { paymentMethod } = action.payload;
        draft.paymentMethods.push(paymentMethod);
        draft.selectedPaymentMethodId = paymentMethod.id;
        draft.campaignCreation.step = "confirm";
        break;
      }
      case "payment method selected": {
        draft.selectedPaymentMethodId = action.payload.paymentMethod.id;
        break;
      }
      case "add new payment method button clicked": {
        draft.campaignCreation.step = "add payment";
        break;
      }
      case "confirm campaign creation back button clicked": {
        draft.campaignCreation.step = "budget and duration";
        break;
      }
      case "campaign creation reset": {
        draft.campaignCreation.step = "budget and duration";
        draft.campaignCreation.dailyBudget = recommendedBudgetUSD;
        draft.campaignCreation.durationDays = initialDurationDays;
        break;
      }
      case "campaign launched": {
        const { campaign, productId } = action.payload;
        draft.campaignIdsByProductId[productId] = campaign.campaignId;
        draft.campaignsById[campaign.campaignId] = campaign;
        draft.campaignCreation.step = "launched";
        break;
      }
      case "edit campaign button clicked": {
        draft.campaignDetails.step = "editing";
        break;
      }
      case "edit campaign back button clicked": {
        draft.campaignDetails.step = "details";
        break;
      }
      case "edit campaign save button clicked": {
        // TODO (samet): what to do after saving somponent
        break;
      }
      case "edit campaign end button clicked": {
        draft.campaignDetails.step = "ending";
        break;
      }
      case "end campaign button clicked": {
        draft.campaignDetails.step = "ended";
        draft.isCloseButtonHidden = true;
        break;
      }
      case "end campaign back button clicked": {
        draft.campaignDetails.step = "editing";
        break;
      }
      case "campaign details reset": {
        draft.campaignDetails.step = "details";
        break;
      }
    }
  });
};
