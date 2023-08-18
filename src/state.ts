import {
  BaseCampaign,
  Campaign,
  CampaignWithReport,
  DefaultBudgetAndCpc,
  ReportDataWithAuctions,
} from "@api/types";
import { produce } from "structurajs";

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
  campaignsById: Record<string, CampaignWithReport>;
  selectedProductId: string | null;
  campaignCreation: {
    step: CampaignCreationStep;
    dailyBudget: number;
    durationDays: number;
    type: "shop" | "product";
  };
  campaignDetails: {
    step: CampaignDetailsStep;
  };
  lastDeletedCampaign: CampaignWithReport | null;
  selectedCampaignId: string | null;
  shopCampaignLaunched: boolean;
  shopCampaignId: string | null;
  shopName: string;
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
    type: "product",
  },
  campaignDetails: {
    step: "details",
  },
  lastDeletedCampaign: null,
  selectedCampaignId: null,
  shopCampaignLaunched: false,
  shopCampaignId: null,
  shopName: "",
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
      type: "set shopName";
      payload: {
        shopName: string;
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
        report: ReportDataWithAuctions;
      };
    }
  | { type: "set shop campaign id"; payload: { campaignId: string } }
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
      type: "product campaign launched";
      payload: {
        campaign: Campaign;
        report: ReportDataWithAuctions;
        productId: string;
      };
    }
  | {
      type: "shop campaign launched";
    }
  | {
      type: "campaign edited";
      payload: {
        campaignUpdate: BaseCampaign;
      };
    }
  | {
      type: "campaign ended";
      payload: {
        campaign: CampaignWithReport;
        productId?: string;
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
        draft.campaignCreation.type = "product";
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
        draft.campaignCreation.type = "shop";
        break;
      }
      case "campaign retrieved": {
        const { campaign, report } = action.payload;
        draft.campaignsById[campaign.campaignId] = { ...campaign, report };
        break;
      }
      case "set shopName": {
        const { shopName } = action.payload;
        draft.shopName = shopName;
        break;
      }
      case "set shop campaign id": {
        const { campaignId } = action.payload;
        draft.shopCampaignId = campaignId;
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
      case "product campaign launched": {
        const { campaign, report, productId } = action.payload;
        draft.campaignIdsByProductId[productId] = campaign.campaignId;
        draft.campaignsById[campaign.campaignId] = { ...campaign, report }
        draft.campaignCreation.step = "launched";
        break;
      }
      case "shop campaign launched": {
        draft.campaignCreation.step = "launched";
        draft.shopCampaignLaunched = true;
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
        if (productId) {
          delete draft.campaignIdsByProductId[productId];
        } else {
          draft.shopCampaignLaunched = false;
          draft.shopCampaignId = null;
        }
        draft.selectedCampaignId = null;
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
