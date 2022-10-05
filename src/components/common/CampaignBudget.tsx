import { Button } from "@components/Button";
import { Campaign } from "@types";
import { h, FunctionalComponent } from "preact";

export const CampaignBudget: FunctionalComponent<
  Pick<Campaign, "budget" | "days"> & {
    onEdit?: () => void;
    showTargetingText?: boolean;
  }
> = ({ budget, days, onEdit, showTargetingText = false }) => {
  return (
    <div className="ts-campaign-budget-duration">
      <div className="ts-campaign-budget-duration-title">
        <div>Budget & Duration</div>
        {onEdit && (
          <Button
            onClick={onEdit}
            variant="text"
            className="ts-edit-campaign-button"
          >
            Edit
          </Button>
        )}
      </div>
      <div class="ts-budget-duration">
        ${budget} over {days} days
        {showTargetingText ? <span>with automatic targeting.</span> : "."}
      </div>
    </div>
  );
};
