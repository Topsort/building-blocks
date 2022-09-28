import { createContext } from "preact";
import { useContext } from "preact/hooks";

import { Action, initialState, State } from "./state";

type CampaignCreationContextValue = {
  dispatch: (action: Action) => void;
  state: State;
};

export const CampaignCreationContext =
  createContext<CampaignCreationContextValue>({
    dispatch: () => {
      throw new Error(
        "CampaignCreationContext: 'dispatch()' must be used inside functional component only!"
      );
    },
    state: initialState,
  });

type UseCampaignCreation = () => CampaignCreationContextValue;

export const useCampaignCreation: UseCampaignCreation = () =>
  useContext<CampaignCreationContextValue>(CampaignCreationContext);
