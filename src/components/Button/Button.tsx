import { usePromotionContext } from "@context";
import * as cx from "classnames";
import { FunctionalComponent, JSX } from "preact";

export const Button: FunctionalComponent<
  JSX.IntrinsicElements["button"] & {
    color?: "font" | "danger";
    fullWidth?: boolean;
    variant: "inline" | "text" | "contained" | "outlined";
  }
> = ({ children, className, color, fullWidth = false, variant, ...props }) => {
  const { style } = usePromotionContext();
  const borderRadius = style.button?.borderRadius || "sm";
  return (
    <button
      className={cx("ts-button", className?.toString(), {
        "ts-button--inline": variant === "inline",
        "ts-button--text": variant === "text",
        "ts-button--contained": variant === "contained",
        "ts-button--outlined": variant === "outlined",
        "ts-button--rounded-sm": borderRadius === "sm",
        "ts-button--rounded-full": borderRadius === "full",
        "ts-button--font": color === "font",
        "ts-button--danger": color === "danger",
        "ts-w-full": fullWidth,
      })}
      {...props}
    >
      {children}
    </button>
  );
};
