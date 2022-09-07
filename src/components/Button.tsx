import { useProductPromotion } from "@context";
import cx from "classnames";
import { h, FunctionalComponent, JSX } from "preact";

export const Button: FunctionalComponent<
  JSX.IntrinsicElements["button"] & {
    variant: "inline" | "text" | "contained" | "outlined";
  }
> = ({ children, className, variant, ...props }) => {
  const { style } = useProductPromotion();
  const borderRadius = style.button?.borderRadius || "sm";
  return (
    <button
      className={cx("ts-button", className, {
        "ts-button--inline": variant === "inline",
        "ts-button--text": variant === "text",
        "ts-button--contained": variant === "contained",
        "ts-button--outlined": variant === "outlined",
        "ts-button--rounded-sm": borderRadius === "sm",
        "ts-button--rounded-full": borderRadius === "full",
      })}
      {...props}
    >
      {children}
    </button>
  );
};
