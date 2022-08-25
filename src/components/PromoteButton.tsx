import { Button } from "@components/Button";
import { promoteButtonClassName, defaultText } from "@constants";
import { CustomText, Style } from "@types";
import { h, FunctionalComponent } from "preact";

export const PromoteButton: FunctionalComponent<{
  onClick: () => void;
  style?: Style;
  text?: CustomText;
  hasCampaign?: boolean;
}> = ({ style, text, onClick, hasCampaign = false }) => {
  return (
    <Button
      className={promoteButtonClassName}
      variant="outlined"
      onClick={onClick}
      _style={style}
    >
      {hasCampaign
        ? text?.detailButton || defaultText.detailButton
        : text?.button || defaultText.promoteButton}
    </Button>
  );
};
