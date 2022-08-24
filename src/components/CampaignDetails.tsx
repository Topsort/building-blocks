import { campaignDetailsClassName } from "@constants";
import { CustomText } from "@types";
import { h, FunctionalComponent } from "preact";
import { Campaign } from "src";

export const CampaignDetails: FunctionalComponent<{
  text?: CustomText;
  productId: string | null;
  campaignDetails: Campaign;
}> = ({ text, productId, campaignDetails }) => {
  return (
    <div className={campaignDetailsClassName}>
      <h2>Campaign Details</h2>
      <div className="space-y-3-5">
        <CampaignData campaignDetails={campaignDetails} />
        <CampaignBudget campaignDetails={campaignDetails} />
        <CampaignMetrics campaignDetails={campaignDetails} />
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

const CampaignData: FunctionalComponent<{
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
          <div className="text-lg">
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
          <CampaignTotal title="Total Spend" value={campaignDetails.totalSpend}/>
          <CampaignTotal title="Total Sales" value={campaignDetails.totalSales}/>
          <CampaignTotal title="ROAS" value={campaignDetails.roas}/>
        </div>
      </div>
    </CampaignDataBox>
  );
};

const CampaignBudget: FunctionalComponent<{
  campaignDetails: Campaign;
}> = ({ campaignDetails }) => {
  return <CampaignDataBox> budget {campaignDetails.budget}</CampaignDataBox>;
};

const CampaignMetrics: FunctionalComponent<{
  campaignDetails: Campaign;
}> = ({ campaignDetails }) => {
  return <CampaignDataBox> metrics {campaignDetails.budget}</CampaignDataBox>;
};
