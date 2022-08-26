import { Button } from "@components/Button";
import { promoteButtonClassName, defaultText } from "@constants";
import { useProductPromotion } from "@context";
import { h, FunctionalComponent } from "preact";

export const PromoteButton: FunctionalComponent<{
  onClick: () => void;
}> = ({ onClick }) => {
  const { text } = useProductPromotion();
  return (
    <Button
      className={promoteButtonClassName}
      variant="outlined"
      onClick={onClick}
    >
      {text.button || defaultText.promoteButton}
    </Button>
  );
};
