import { ModalContent, ModalHeading } from "@components/Modal";
import { Campaign } from "@types";
import { h, FunctionalComponent } from "preact";
import { useReducer } from "preact/hooks";

import { Details } from "./Details";
import { Ending } from "./Ending";
import { CampaignDetailsContext } from "./context";
import { initialState, reducer } from "./state";
import "./style.css";

export const CampaignDetails: FunctionalComponent<{
  campaign: Campaign;
}> = ({ campaign }) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { step } = state;

  const { title, content } = (() => {
    switch (step) {
      case "details": {
        return {
          title: "Campaign Details",
          content: <Details campaign={campaign} />,
        };
      }
      case "ending": {
        return {
          title: "You're about to end this campaign",
          content: <Ending campaign={campaign} />,
        };
      }
    }
  })();

  const contentHeight = (() => {
    switch (step) {
      case "details":
        return "24rem";
      case "ending":
        return "fit-content";
      default:
        return undefined;
    }
  })();

  return (
    <CampaignDetailsContext.Provider value={{ state, dispatch }}>
      <ModalHeading>{title}</ModalHeading>
      <ModalContent height={contentHeight}>{content}</ModalContent>
    </CampaignDetailsContext.Provider>
  );
};
