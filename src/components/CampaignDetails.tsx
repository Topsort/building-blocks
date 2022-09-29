import { Button } from "@components/Button";
import { ModalContent, ModalHeading } from "@components/Modal";
import { Campaign } from "@types";
import { h, FunctionalComponent, Fragment } from "preact";

import { Icon, IconName } from "./Icon";

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
          <CampaignMetrics campaignDetails={campaignDetails} />
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

const CampaignMetrics: FunctionalComponent<{
  campaignDetails: Campaign;
}> = ({ campaignDetails }) => {
  return (
    <div className="ts-campaign-details-metrics">
      <span className="ts-campaign-metrics-title">Metrics</span>
      <div class="ts-metrics-grid">
        <Metric
          title="Impressions"
          value={campaignDetails.impressions}
          iconName="eye"
        />
        <Metric
          title="Clicks"
          value={campaignDetails.clicks}
          iconName="mouse-square"
        />
        <Metric
          title="Purchases"
          value={campaignDetails.purchases}
          iconName="bag"
        />
        <Metric
          title="Total spend"
          value={campaignDetails.totalSpend}
          iconName="money"
        />
        <Metric
          title="Total sales"
          value={campaignDetails.totalSales}
          iconName="message-add"
        />
        <Metric
          title="ROAS"
          value={campaignDetails.roas}
          iconName="back-square"
        />
      </div>
    </div>
  );
};

const Metric: FunctionalComponent<{
  title: string;
  value: number | string;
  iconName: IconName;
}> = ({ title, value, iconName }) => {
  return (
    <div className="ts-metric">
      <Icon name={iconName} title={title} />
      <div className="ts-metric-content">
        <span className="ts-metric-title">{title}</span>
        <span className="ts-metric-value">{value}</span>
      </div>
    </div>
  );
};
