import { campaignDetailsClassName } from "@constants";
import { CustomText } from "@types";
import { h, FunctionalComponent } from "preact";
import { Campaign } from "src";



export const CampaignDetails: FunctionalComponent<{
  text?: CustomText;
  productId: string | null;
  campaignDetails: Campaign;
}> = ({ text, productId,campaignDetails }) => {
  return (
    <div className={campaignDetailsClassName}>
      <h2>Campaign Details</h2>
      <div>
        <CampaignData campaignDetails={campaignDetails} />
        <CampaignBudget campaignDetails={campaignDetails} />
        <CampaignMetrics campaignDetails={campaignDetails} />
      </div>
    </div>
  );
};

const CampaignData: FunctionalComponent<{
  campaignDetails: Campaign;
}> = ({ campaignDetails }) => {
  return <div> data {campaignDetails.budget}</div>;
};

const CampaignBudget: FunctionalComponent<{
  campaignDetails: Campaign;
}> = ({ campaignDetails }) => {
  return <div> budget {campaignDetails.budget}</div>;
};

const CampaignMetrics: FunctionalComponent<{
  campaignDetails: Campaign;
}> = ({ campaignDetails }) => {
  return <div> metrics {campaignDetails.budget}</div>;
};
