import { campaignDetailsClassName } from "@constants";
import { h, FunctionalComponent } from "preact";
import { Campaign } from "src";

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
      <div className="title">{title}</div>
      <div className="value">{value}</div>
    </div>
  );
};

const CampaignSummary: FunctionalComponent<{
  campaignDetails: Campaign;
}> = ({ campaignDetails }) => {
  return (
    <div className="ts-campaign-data-box space-y-4">
      <div className="ts-flex ts-flex-row space-x-4">
        <img class="ts-product-image" src={campaignDetails.productImageUrl} />
        <div className="ts-text-lg" style="margin-right:1rem;">
          {campaignDetails.name}
        </div>
        <div class="ts-flex ts-flex-col">
          <div style="text-align: right;">{campaignDetails.budget}</div>
          <div
            className="ts-text-xsts-text-gray"
            style="text-align: right;white-space: nowrap;"
          >
            Daily Budget
          </div>
        </div>
      </div>
      <div className="ts-purple-box">
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
      <div className="title">
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
      <hr className="ts-gray-hr" />
      <div style="margin-top:0.875rem;">
        <div>
          <span className="ts-font-medium">{campaignDetails.budget} </span>over
          <span className="ts-font-medium"> {campaignDetails.days} </span>days.
        </div>
        <div style="margin-top:0.25rem;" className="ts-text-sm">
          <span className="ts-text-gray" style="font-style: italic;">
            Your minimun return on ad spend is
          </span>
          <span className="ts-font-medium"> {campaignDetails.minRoas}</span>.
        </div>
      </div>
    </div>
  );
};

const CampaignMetrics: FunctionalComponent<{
  campaignDetails: Campaign;
}> = ({ campaignDetails }) => {
  return (
    <div className="ts-campaign-data-box">
      <div className="title ts-self-center">Metrics</div>
      <hr className="ts-gray-hr" />
      <div className="ts-metric-grid">
        <div className="title">Impressions</div>
        <div className="title">Clicks</div>
        <div className="title">Purchases</div>
        <div className="title">Status</div>
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
    <div style="text-align: right;padding-top:0.875rem">
      {campaignDetails.status ? (
        <Button variant="outlined">Pause Campaign</Button>
      ) : (
        <Button variant="outlined">Resume Campaign</Button>
      )}
      <Button variant="contained" style="margin-left:0.5rem;">
        End Campaign
      </Button>
    </div>
  );
};
