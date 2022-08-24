import { campaignCreationClassName } from "@constants";
import { CustomText } from "@types";
import { h, FunctionalComponent } from "preact";
import { Campaign } from "src";



export const CampaignDetails: FunctionalComponent<{
  text?: CustomText;
  productId: string | null;
  campaignDetails: Campaign;
}> = ({ text, productId,campaignDetails }) => {
  return (
    <div className={campaignCreationClassName}>
      <h2>{campaignDetails.name}</h2>
      <span>{productId}</span>
      
    </div>
  );
};