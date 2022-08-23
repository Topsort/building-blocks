import { campaignCreationClassName, defaultText } from "@constants";
import { CustomText } from "@types";
import { h, FunctionalComponent } from "preact";

export const CampaignCreation: FunctionalComponent<{
  text?: CustomText;
  productId: string | null;
}> = ({ text, productId }) => {
  return (
    <div className={campaignCreationClassName}>
      <h2>{text?.modalTitle || defaultText.modalTitle}</h2>
      <h3>{text?.modalSubtitle || defaultText.modalSubtitle}</h3>
      <span>{productId}</span>
      <input
        placeholder={
          text?.modalCampaignNamePlaceholder ||
          defaultText.modalCampaignNamePlaceholder
        }
      />
    </div>
  );
};
