import { Button } from "@components/Button";
import { useProductPromotion } from "@context";
import { h, FunctionalComponent } from "preact";

export const CampaignBudget: FunctionalComponent<{
  budget: number; // integer value
  days: number | "infinite";
  onEdit?: () => void;
  showTargetingText?: boolean;
}> = ({ budget, days, onEdit, showTargetingText = false }) => {
  const { moneyFormater } = useProductPromotion();
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
        {moneyFormater.format(budget / 100)} over{" "}
        {typeof days === "number" ? days : "infinite"}{" "}
        {days === 1 ? "day" : "days"}
        {showTargetingText ? <span>with automatic targeting.</span> : "."}
      </div>
    </div>
  );
};
