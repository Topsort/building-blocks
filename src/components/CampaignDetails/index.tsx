import { Icon } from "@components/Icon";
import { ModalContent, ModalHeading } from "@components/Modal";
import { Campaign } from "@types";
import { h, FunctionalComponent, Fragment } from "preact";
import { useReducer } from "preact/hooks";

import { Details } from "./Details";
import { Ended } from "./Ended";
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
      case "ended": {
        return {
          title: (
            <Fragment>
              <Icon size={32} name="tick-circle" />
              <span>Your campaign was launched!</span>
            </Fragment>
          ),
          content: <Ended campaign={campaign} />,
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
      case "ended":
        return "fit-content";
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
