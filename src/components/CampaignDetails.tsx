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
  return <div className="ts-border-box p-1 font-medium"> {children}</div>;
};

const CampaignData: FunctionalComponent<{
  campaignDetails: Campaign;
}> = ({ campaignDetails }) => {
  return (
    <CampaignDataBox>
      <div className="flex flex-row space-x-4">
        <img
          class="ts-border-box w-17 h-17"
          src="//www.html.am/images/image-codes/milford_sound_t.jpg" //src={campaignDetails.productImageUrl}
        />
        <div
          style="font-size: 18px;line-height: 23px;"
        >
          {campaignDetails.name}
        </div>
        <div class="flex flex-col">
          <div style="text-align: right;">{campaignDetails.budget}</div>
          <div className="text-xs text-gray" style="text-align: right;white-space: nowrap;">
            Daily Budget
          </div>
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
