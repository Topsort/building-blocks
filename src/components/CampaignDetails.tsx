import { Button } from "@components/Button";
import { ModalContent, ModalHeading } from "@components/Modal";
import { Campaign } from "@types";
import { h, FunctionalComponent, Fragment } from "preact";

export const CampaignDetails: FunctionalComponent<{
  campaignDetails: Campaign;
}> = ({ campaignDetails }) => {
  return (
    <Fragment>
      <ModalHeading>Campaign Details</ModalHeading>
      <ModalContent height="32rem">
        <div className="ts-space-y-3-5">
          <CampaignSummary campaignDetails={campaignDetails} />
          <CampaignBudget campaignDetails={campaignDetails} />
        </div>
      </ModalContent>
    </Fragment>
  );
};

const CampaignSummary: FunctionalComponent<{
  campaignDetails: Campaign;
}> = ({ campaignDetails }) => {
  return (
    <div className="ts-campaign-summary ts-space-x-4">
      <img class="ts-product-image" src={campaignDetails.productImageUrl} />
      <div className="ts-campaign-summary-name">
        <span>{campaignDetails.name}</span>
        <span className="ts-campaign-summary-time">
          1 day 12:30:45 since running.
        </span>
      </div>
    </div>
  );
};

const CampaignBudget: FunctionalComponent<{
  campaignDetails: Campaign;
}> = ({ campaignDetails }) => {
  return (
    <div className="ts-campaign-budget-duration">
      <div className="ts-campaign-budget-duration-title">
        <div>Budget & Duration</div>
        <Button
          onClick={() => {
            console.log("edit campaign");
          }}
          variant="text"
          className="ts-edit-campaign-button"
        >
          Edit or end
        </Button>
      </div>
      <div class="ts-budget-by-day">
        ${campaignDetails.budget} over {campaignDetails.days} days.
      </div>
    </div>
  );
};
