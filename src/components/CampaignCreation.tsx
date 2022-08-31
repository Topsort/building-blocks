import { Button } from "@components/Button";
import { defaultText } from "@constants";
import { useProductPromotion } from "@context";
import { h, FunctionalComponent } from "preact";

export const CampaignCreation: FunctionalComponent<{
  productId: string | null;
}> = ({ productId }) => {
  const { text } = useProductPromotion();
  return (
    <div className="ts-campaign-creation">
      <h2>{text.modalTitle || defaultText.modalTitle}</h2>
      <h3>{text.modalSubtitle || defaultText.modalSubtitle}</h3>
      <span>{productId}</span>
      <input
        placeholder={
          text.modalCampaignNamePlaceholder ||
          defaultText.modalCampaignNamePlaceholder
        }
      />
      {/* Testing the button variants: */}
      <div style={{ display: "flex", marginTop: "1rem", gap: "0.5rem" }}>
        <Button variant="text">Text</Button>
        <Button variant="contained">Contained</Button>
        <Button variant="outlined">Outlined</Button>
      </div>
    </div>
  );
};
