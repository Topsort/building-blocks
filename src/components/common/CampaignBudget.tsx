import { Button } from "@components/Button";
import { usePromotionContext } from "@context";
import { FunctionalComponent } from "preact";

export const CampaignBudget: FunctionalComponent<{
  days: number | "infinite";
  budget?: number;
  onEdit?: () => void;
  showTargetingText?: boolean;
}> = ({ budget, days, onEdit, showTargetingText = false }) => {
  const { formatMoney } = usePromotionContext();
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
        {budget != null ? formatMoney(budget) : "-"} over{" "}
        {typeof days === "number" ? days : "infinite"}{" "}
        {days === 1 ? "day" : "days"}
        {showTargetingText ? <span>with automatic targeting.</span> : "."}
      </div>
    </div>
  );
};
