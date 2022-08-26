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

const CampaignDataBox: FunctionalComponent = ({ children }) => {
  return (
    <div className="border-gray rounded-xl p-4 font-medium"> {children}</div>
  );
};
const CampaignTotal: FunctionalComponent<{ title: string; value: string }> = ({
  title,
  value,
}) => {
  return (
    <div className="flex flex-col" style="align-items: center;">
      <div className="text-gray text-sm">{title}</div>
      <div style="margin-top:0.25rem" className="text-purple">
        {value}
      </div>
    </div>
  );
};

const CampaignSummary: FunctionalComponent<{
  campaignDetails: Campaign;
}> = ({ campaignDetails }) => {
  return (
    <CampaignDataBox>
      <div className="flex flex-col space-y-4">
        <div className="flex flex-row space-x-4">
          <img
            class="border-gray rounded-xl w-17 h-17"
            src={campaignDetails.productImageUrl}
          />
          <div className="text-lg" style="margin-right:1rem;">
            {campaignDetails.name}
          </div>
          <div class="flex flex-col">
            <div style="text-align: right;">{campaignDetails.budget}</div>
            <div
              className="text-xs text-gray"
              style="text-align: right;white-space: nowrap;"
            >
              Daily Budget
            </div>
          </div>
        </div>
        <div
          className="flex rounded-xl p-3-5"
          style="background: rgba(94, 59, 221, 0.03);justify-content: space-around;"
        >
          <CampaignTotal
            title="Total Spend"
            value={campaignDetails.totalSpend}
          />
          <CampaignTotal
            title="Total Sales"
            value={campaignDetails.totalSales}
          />
          <CampaignTotal title="ROAS" value={campaignDetails.roas} />
        </div>
      </div>
    </CampaignDataBox>
  );
};

const CampaignBudget: FunctionalComponent<{
  campaignDetails: Campaign;
}> = ({ campaignDetails }) => {
  return (
    <CampaignDataBox>
      <div className="flex flex-col">
        <div
          className="flex flex-row"
          style="justify-content: space-between;align-items: center;margin-bottom:0.5rem;"
        >
          <div className="text-lg">Budget & Duration</div>
          <Button
            onClick={() => {
              console.log("click");
            }}
            variant="text"
          >
            Edit
          </Button>
        </div>
        <hr className="ts-gray-hr" />
        <div style="margin-top:0.875rem;">
          <div>
            <span className="font-medium">{campaignDetails.budget} </span>over
            <span className="font-medium"> {campaignDetails.days} </span>days.
          </div>
          <div style="margin-top:0.25rem;" className="text-sm">
            <span className="text-gray" style="font-style: italic;">
              Your minimun return on ad spend is
            </span>
            <span className="font-medium"> {campaignDetails.minRoas}</span>.
          </div>
        </div>
      </div>
    </CampaignDataBox>
  );
};

const CampaignMetrics: FunctionalComponent<{
  campaignDetails: Campaign;
}> = ({ campaignDetails }) => {
  return (
    <CampaignDataBox>
      <div className="flex flex-col">
        <div
          className="text-lg"
          style="align-self: center;margin-bottom:0.875rem;"
        >
          Metrics
        </div>
        <hr className="ts-gray-hr" />
        <div
          style="margin-top:0.875rem;justify-content: space-between;"
          className="ts-metric-grid "
        >
          <div className="text-gray text-sm">Impressions</div>
          <div className="text-gray text-sm">Clicks</div>
          <div className="text-gray text-sm">Purchases</div>
          <div className="text-gray text-sm">Status</div>
          <div>{campaignDetails.impressions}</div>
          <div>{campaignDetails.clicks}</div>
          <div>{campaignDetails.purchases}</div>
          <div>
            <Switch />
          </div>
        </div>
      </div>
    </CampaignDataBox>
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
