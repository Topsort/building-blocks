import { campaignDetailsClassName } from "@defaults";
import { Style } from "@types";
import { h, FunctionalComponent } from "preact";
import { Campaign } from "src";

export const CampaignDetails: FunctionalComponent<{
  style?: Style;
  productId: string | null;
  campaignDetails: Campaign;
}> = ({ productId, campaignDetails }) => {
  return (
    <div className={campaignDetailsClassName}>
      <h2>{campaignDetails.name}</h2>
      <h3>budget{campaignDetails.budget}</h3>
      <span>{productId}</span>
    </div>
  );
};
