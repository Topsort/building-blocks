import { Button } from "@components/Button";
import { campaignCreationClassName, defaultText } from "@constants";
import { CustomText, Style } from "@types";
import { h, FunctionalComponent } from "preact";

export const CampaignCreation: FunctionalComponent<{
  productId: string | null;
  style?: Style;
  text?: CustomText;
}> = ({ productId, style, text }) => {
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
      {/* Testing the button variants: */}
      <div style={{ display: "flex", marginTop: "1rem", gap: "0.5rem" }}>
        <Button variant="text" _style={style}>
          Text
        </Button>
        <Button variant="contained" _style={style}>
          Contained
        </Button>
        <Button variant="outlined" _style={style}>
          Outlined
        </Button>
      </div>
    </div>
  );
};
