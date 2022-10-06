import { Campaign } from "@api/types";

export type State = {
  campaignsById: Record<string, Campaign>;
};

export const initialState: State = {
  campaignsById: {},
};

export type Action = {
  type: "campaign retrieved";
  payload: {
    campaign: Campaign;
  };
};

export const reducer = (
  state: Readonly<State>,
  action: Readonly<Action>
): State => {
  switch (action.type) {
    case "campaign retrieved": {
      const { campaign } = action.payload;
      return {
        ...state,
        campaignsById: {
          ...state.campaignsById,
          [campaign.campaignId]: campaign,
        },
      };
    }
  }
};
