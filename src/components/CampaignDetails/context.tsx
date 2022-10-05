import { createContext } from "preact";
import { useContext } from "preact/hooks";

import { Action, initialState, State } from "./state";

type CampaignDetailsContextValue = {
  dispatch: (action: Action) => void;
  state: State;
};

export const CampaignDetailsContext =
  createContext<CampaignDetailsContextValue>({
    dispatch: () => {
      throw new Error(
        "CampaignDetailsContext: 'dispatch()' must be used inside functional component only!"
      );
    },
    state: initialState,
  });

type UseCampaignDetails = () => CampaignDetailsContextValue;

export const useCampaignDetails: UseCampaignDetails = () =>
  useContext<CampaignDetailsContextValue>(CampaignDetailsContext);
