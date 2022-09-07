import { Button } from "@components/Button";
import { defaultText } from "@constants";
import { useProductPromotion } from "@context";
import { h, FunctionalComponent } from "preact";

export const PromoteButton: FunctionalComponent<{
  onClick: () => void;
  hasCampaign?: boolean;
}> = ({ onClick, hasCampaign = false }) => {
  const { text } = useProductPromotion();
  return (
    <Button className="ts-promote-button" variant="outlined" onClick={onClick}>
      {hasCampaign
        ? text.detailButton || defaultText.detailButton
        : text.promoteButton || defaultText.promoteButton}
    </Button>
  );
};
