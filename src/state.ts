import { Campaign, DefaultBudgetAndCpc, PartialCampaign } from "@api/types";
import { produce } from "immer";

export const initialDurationDays = 15;
export const minDurationDays = 1;
export const maxDurationDays = 30;

type CampaignCreationStep = "budget and duration" | "confirm" | "launched";

type CampaignDetailsStep = "details" | "editing" | "ending";

type ProductData = {
  id: string;
  name: string;
  imgUrl: string;
};

export type State = {
  defaultBudget: DefaultBudgetAndCpc["defaultBudget"];
  marketplaceCpc: DefaultBudgetAndCpc["cpc"];
  productDataById: Record<string, ProductData>;
  isModalOpen: boolean;
  campaignIdsByProductId: Record<string, string | null>;
  campaignsById: Record<string, Campaign>;
  selectedProductId: string | null;
  campaignCreation: {
    step: CampaignCreationStep;
    dailyBudget: number;
    durationDays: number;
  };
  campaignDetails: {
    step: CampaignDetailsStep;
  };
  lastDeletedCampaign: Campaign | null;
  selectedCampaignId: string | null;
};

export const initialState: State = {
  defaultBudget: 0,
  marketplaceCpc: {
    lowerBound: 0,
    upperBound: 0,
  },
  productDataById: {},
  isModalOpen: false,
  campaignIdsByProductId: {},
  campaignsById: {},
  selectedProductId: null,
  campaignCreation: {
    step: "budget and duration",
    dailyBudget: 0,
    durationDays: initialDurationDays,
  },
  campaignDetails: {
    step: "details",
  },
  lastDeletedCampaign: null,
  selectedCampaignId: null,
};

export type Action =
  | {
      type:
        | "modal close button clicked"
        | "budget and duration next button clicked"
        | "confirm campaign creation back button clicked"
        | "campaign creation reset"
        | "edit campaign button clicked"
        | "edit campaign back button clicked"
        | "edit campaign end button clicked"
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
      type: "default budget and cpc retrieved";
      payload: DefaultBudgetAndCpc;
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
      type: "set campaign Id";
      payload: {
        campaignId: string | null;
      };
    }
  | { type: "promote shop button clicked" }
  | {
      type: "campaign retrieved";
      payload: {
        campaign: Campaign;
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
    }
  | {
      type: "campaign edited";
      payload: {
        campaignUpdate: PartialCampaign;
      };
    }
  | {
      type: "campaign ended";
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
        draft.selectedProductId = null;
        draft.lastDeletedCampaign = null;
        break;
      }
      case "default budget and cpc retrieved": {
        const { defaultBudget, cpc } = action.payload;
        draft.defaultBudget = defaultBudget;
        draft.marketplaceCpc = cpc;
        draft.campaignCreation.dailyBudget = defaultBudget;
        break;
      }
      case "campaign ids by product id retrieved": {
        Object.assign(
          draft.campaignIdsByProductId,
          action.payload.campaignIdsByProductId
        );
        break;
      }
      case "product selected": {
        draft.selectedProductId = action.payload.productId;
        draft.isModalOpen = true;
        draft.lastDeletedCampaign = null;
        break;
      }
      case "set campaign Id": {
        draft.selectedCampaignId = action.payload.campaignId;
        break;
      }
      case "promote shop button clicked": {
        draft.selectedProductId = null;
        draft.isModalOpen = true;
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
        draft.campaignCreation.step = "confirm";
        break;
      }
      case "confirm campaign creation back button clicked": {
        draft.campaignCreation.step = "budget and duration";
        break;
      }
      case "campaign creation reset": {
        draft.campaignCreation.step = "budget and duration";
        draft.campaignCreation.dailyBudget = state.defaultBudget;
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
      case "campaign edited": {
        const { campaignUpdate } = action.payload;
        Object.assign(
          draft.campaignsById[campaignUpdate.campaignId],
          campaignUpdate
        );
        draft.campaignDetails.step = "details";
        break;
      }
      case "edit campaign back button clicked": {
        draft.campaignDetails.step = "details";
        break;
      }
      case "edit campaign end button clicked": {
        draft.campaignDetails.step = "ending";
        break;
      }
      case "campaign ended": {
        const { campaign, productId } = action.payload;
        delete draft.campaignIdsByProductId[productId];
        delete draft.campaignsById[campaign.campaignId];
        draft.lastDeletedCampaign = campaign;
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
