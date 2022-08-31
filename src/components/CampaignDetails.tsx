import { Button } from "@components/Button";
import { Switch } from "@components/Switch";
import { Campaign } from "@types";
import { h, FunctionalComponent } from "preact";

export const CampaignDetails: FunctionalComponent<{
  campaignDetails: Campaign;
}> = ({ campaignDetails }) => {
  return (
    <div className="ts-space-y-3-5">
      <CampaignSummary campaignDetails={campaignDetails} />
      <CampaignBudget campaignDetails={campaignDetails} />
      <CampaignMetrics campaignDetails={campaignDetails} />
      <ManageCampaignStatus campaignDetails={campaignDetails} />
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
    <div className="ts-campaign-data-box ts-space-y-4">
      <div className="ts-flex ts-space-x-4">
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
      <div className="ts-budget-duration">
        <span>
          <span className="ts-font-medium">{campaignDetails.budget} </span>over
          <span className="ts-font-medium"> {campaignDetails.days} </span>days.
        </span>
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
        <div className="ts-campaign-metrics-header">Impressions</div>
        <div className="ts-campaign-metrics-header">Clicks</div>
        <div className="ts-campaign-metrics-header">Purchases</div>
        <div className="ts-campaign-metrics-header">Status</div>
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
    <div className="ts-space-x-2 ts-campaign-status-buttons">
      {campaignDetails.status ? (
        <Button variant="outlined">Pause Campaign</Button>
      ) : (
        <Button variant="outlined">Resume Campaign</Button>
      )}
      <Button variant="contained">End Campaign</Button>
    </div>
  );
};
