import { ModalContent, ModalHeading } from "@components/Modal";
import { CampaignBudget, CampaignSummary } from "@components/common";
import { Campaign } from "@types";
import { h, FunctionalComponent, Fragment } from "preact";

import { CampaignMetrics } from "./CampaignMetrics";

export const CampaignDetails: FunctionalComponent<{
  campaignDetails: Campaign;
}> = ({ campaignDetails }) => {
  return (
    <Fragment>
      <ModalHeading>Campaign Details</ModalHeading>
      <ModalContent height="32rem">
        <div className="ts-space-y-3-5">
          <CampaignSummary
            name={campaignDetails.name}
            productImageUrl={campaignDetails.productImageUrl}
            showSummaryTime
          />
          <CampaignBudget
            budget={campaignDetails.budget}
            days={campaignDetails.days}
            onEditOrEnd={() => console.log("edit or end clicked")}
          />
          <CampaignMetrics title="Metrics" campaignDetails={campaignDetails} />
        </div>
      </ModalContent>
    </Fragment>
  );
};
