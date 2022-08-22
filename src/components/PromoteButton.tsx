import { buttonClassName, buttonTextClassName, defaultText } from "@defaults";
import { CustomText, Style } from "@types";
import cx from "classnames";
import { h, FunctionalComponent } from "preact";

export const PromoteButton: FunctionalComponent<{
  style?: Style;
  text?: CustomText;
  onClick: () => void;
  hasCampaign?: boolean;
}> = ({ style, text, onClick, hasCampaign = false }) => {
  return (
    <button
      className={cx(style?.button?.className, {
        [buttonClassName]: !style?.button?.replace,
      })}
      onClick={onClick}
    >
      <span
        className={cx(style?.buttonText?.className, {
          [buttonTextClassName]: !style?.buttonText?.replace,
        })}
      >
        {hasCampaign
          ? text?.detailButton || defaultText.detailButton
          : text?.button || defaultText.button}
      </span>
    </button>
  );
};
