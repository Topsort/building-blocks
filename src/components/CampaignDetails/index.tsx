import { ModalContent, ModalHeading } from "@components/Modal";
import { CampaignBudget, CampaignSummary } from "@components/common";
import { Campaign } from "@types";
import { h, FunctionalComponent, Fragment } from "preact";

import { CampaignMetrics } from "./CampaignMetrics";
import "./style.css";

export const CampaignDetails: FunctionalComponent<{
  campaign: Campaign;
}> = ({ campaign }) => {
  return (
    <Fragment>
      <ModalHeading>Campaign Details</ModalHeading>
      <ModalContent height="32rem">
        <div className="ts-space-y-3-5">
          <CampaignSummary
            name={campaign.name}
            productImageUrl={campaign.productImageUrl}
            showSummaryTime
          />
          <CampaignBudget
            budget={campaign.budget}
            days={campaign.days}
            onEditOrEnd={() => console.log("edit or end clicked")}
          />
          <hr className="ts-hr" />
          <CampaignMetrics title="Metrics" campaign={campaign} />
        </div>
      </ModalContent>
    </Fragment>
  );
};
