import { Button } from "@components/Button";
import { Campaign } from "@types";
import { h, FunctionalComponent } from "preact";

export const CampaignBudget: FunctionalComponent<
  Pick<Campaign, "budget" | "days"> & {
    onEditOrEnd?: () => void;
    showTargetingText?: boolean;
  }
> = ({ budget, days, onEditOrEnd, showTargetingText = false }) => {
  return (
    <div className="ts-campaign-budget-duration">
      <div className="ts-campaign-budget-duration-title">
        <div>Budget & Duration</div>
        {onEditOrEnd && (
          <Button
            onClick={onEditOrEnd}
            variant="text"
            className="ts-edit-campaign-button"
          >
            Edit or end
          </Button>
        )}
      </div>
      <div class="ts-budget-duration">
        ${budget} over {days} days
        {showTargetingText && " with automatic targeting"}.
      </div>
    </div>
  );
};
