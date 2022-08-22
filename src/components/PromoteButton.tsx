import { buttonClassName, buttonTextClassName, defaultText } from "@constants";
import { CustomText, Style } from "@types";
import cx from "classnames";
import { h, FunctionalComponent } from "preact";

export const PromoteButton: FunctionalComponent<{
  style?: Style;
  text?: CustomText;
  onClick: () => void;
}> = ({ style, text, onClick }) => {
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
        {text?.button || defaultText.button}
      </span>
    </button>
  );
};
