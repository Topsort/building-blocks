import { campaignDetailsClassName } from "@constants";
import { Campaign } from "@types";
import { h, FunctionalComponent } from "preact";

import { Button } from "./Button";
import { Switch } from "./Switch";

export const CampaignDetails: FunctionalComponent<{
  campaignDetails: Campaign;
}> = ({ campaignDetails }) => {
  return (
    <div className={campaignDetailsClassName}>
      <h2>Campaign Details</h2>
      <div className="space-y-3-5">
        <CampaignSummary campaignDetails={campaignDetails} />
        <CampaignBudget campaignDetails={campaignDetails} />
        <CampaignMetrics campaignDetails={campaignDetails} />
        <ManageCampaignStatus campaignDetails={campaignDetails} />
      </div>
    </div>
  );
};

const CampaignTotal: FunctionalComponent<{ title: string; value: string }> = ({
  title,
  value,
}) => {
  return (
    <div className="ts-campaign-totals">
      <div className="ts-section-heading">{title}</div>
      <div className="ts-section-value">{value}</div>
    </div>
  );
};

const CampaignSummary: FunctionalComponent<{
  campaignDetails: Campaign;
}> = ({ campaignDetails }) => {
  return (
    <div className="ts-campaign-data-box space-y-4">
      <div className="ts-flex space-x-4">
        <img class="ts-product-image" src={campaignDetails.productImageUrl} />
        <span className="ts-campaign-summary-name">{campaignDetails.name}</span>
        <div class="ts-campaign-budget">
          <span>{campaignDetails.budget}</span>
          <span className="ts-text-xs ts-text-gray">Daily Budget</span>
        </div>
      </div>
      <div className="ts-info-box">
        <CampaignTotal title="Total Spend" value={campaignDetails.totalSpend} />
        <CampaignTotal title="Total Sales" value={campaignDetails.totalSales} />
        <CampaignTotal title="ROAS" value={campaignDetails.roas} />
      </div>
    </div>
  );
};

const CampaignBudget: FunctionalComponent<{
  campaignDetails: Campaign;
}> = ({ campaignDetails }) => {
  return (
    <div className="ts-campaign-data-box">
      <div className="ts-section-heading">
        <div>Budget & Duration</div>
        <Button
          onClick={() => {
            console.log("edit campaign");
          }}
          variant="text"
        >
          Edit
        </Button>
      </div>
      <hr className="ts-hr" />
      <div style="margin-top:0.875rem;">
        <div>
          <span className="ts-font-medium">{campaignDetails.budget} </span>over
          <span className="ts-font-medium"> {campaignDetails.days} </span>days.
        </div>
        <span className="ts-min-roas">
          Your minimun return on ad spend is
          <span> {campaignDetails.minRoas}</span>.
        </span>
      </div>
    </div>
  );
};

const CampaignMetrics: FunctionalComponent<{
  campaignDetails: Campaign;
}> = ({ campaignDetails }) => {
  return (
    <div className="ts-campaign-data-box">
      <div className="ts-section-heading ts-self-center">Metrics</div>
      <hr className="ts-hr" />
      <div className="ts-campaign-metrics">
        <div className="ts-campaign-metrics-headers">Impressions</div>
        <div className="ts-campaign-metrics-headers">Clicks</div>
        <div className="ts-campaign-metrics-headers">Purchases</div>
        <div className="ts-campaign-metrics-headers">Status</div>
        <div>{campaignDetails.impressions}</div>
        <div>{campaignDetails.clicks}</div>
        <div>{campaignDetails.purchases}</div>
        <div>
          <Switch />
        </div>
      </div>
    </div>
  );
};

const ManageCampaignStatus: FunctionalComponent<{
  campaignDetails: Campaign;
}> = ({ campaignDetails }) => {
  return (
    <div className="space-x-2 ts-campaign-status-buttons">
      {campaignDetails.status ? (
        <Button variant="outlined">Pause Campaign</Button>
      ) : (
        <Button variant="outlined">Resume Campaign</Button>
      )}
      <Button variant="contained">End Campaign</Button>
    </div>
  );
};
