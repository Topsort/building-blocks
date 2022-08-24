import { Button } from "@components/Button";
import { promoteButtonClassName, defaultText } from "@constants";
import { CustomText, Style } from "@types";
import { h, FunctionalComponent } from "preact";

export const PromoteButton: FunctionalComponent<{
  onClick: () => void;
  style?: Style;
  text?: CustomText;
}> = ({ onClick, text, style }) => {
  return (
    <Button
      className={promoteButtonClassName}
      variant="outlined"
      onClick={onClick}
      _style={style}
    >
      {text?.button || defaultText.promoteButton}
    </Button>
  );
};
