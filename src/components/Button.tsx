import { buttonClassName } from "@constants";
import { Style } from "@types";
import cx from "classnames";
import { h, FunctionalComponent, JSX } from "preact";

export const Button: FunctionalComponent<
  JSX.IntrinsicElements["button"] & {
    variant: "text" | "contained" | "outlined";
    // This is temporary to prevent combining with the HTML style prop.
    // Will be removed once `style` is moved into context.
    _style?: Style;
  }
> = ({ children, className, variant, _style, ...props }) => {
  const borderRadius = _style?.button?.borderRadius || "sm";
  return (
    <button
      className={cx(buttonClassName, className, {
        "ts-button--text": variant === "text",
        "ts-button--contained": variant === "contained",
        "ts-button--outlined": variant === "outlined",
        "ts-button--rounded-sm": borderRadius === "sm",
        "ts-button--rounded-full": borderRadius === "full",
      })}
      {...props}
    >
      <span>{children}</span>
    </button>
  );
};
