import { Button } from "@components/Button";
import { defaultText } from "@constants";
import { usePromotionContext } from "@context";
import { RequestStatus } from "@types";
import { h, FunctionalComponent } from "preact";

export const PromoteButton: FunctionalComponent<{
  onClick: () => void;
  status: RequestStatus;
  hasCampaign?: boolean;
}> = ({ onClick, status, hasCampaign = false }) => {
  const { text } = usePromotionContext();
  const content = (() => {
    switch (status) {
      case "pending":
        return "Loading...";
      case "error":
        return "Error";
      default:
        return hasCampaign
          ? text.detailButton || defaultText.detailButton
          : text.promoteButton || defaultText.promoteButton;
    }
  })();

  const disabled = status === "pending" || status === "error";

  return (
    <Button
      className="ts-promote-button"
      variant="outlined"
      onClick={() => {
        if (!disabled) {
          onClick();
        }
      }}
      disabled={disabled}
    >
      {content}
    </Button>
  );
};
