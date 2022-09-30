import { Campaign } from "@types";
import { h, FunctionalComponent } from "preact";

export const CampaignSummary: FunctionalComponent<
  Pick<Campaign, "productImageUrl" | "name"> & {
    showSummaryTime?: boolean;
  }
> = ({ productImageUrl, name, showSummaryTime = false }) => {
  return (
    <div className="ts-campaign-summary ts-space-x-4">
      <img
        class="ts-product-image ts-product-image--md"
        src={productImageUrl}
      />
      <div className="ts-campaign-summary-name">
        <span>{name}</span>
        {showSummaryTime && (
          <span className="ts-campaign-summary-time">
            1 day 12:30:45 since running.
          </span>
        )}
      </div>
    </div>
  );
};
