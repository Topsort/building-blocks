import { closeButtonClassName } from "@constants";
import cx from "classnames";
import { h, FunctionalComponent, JSX } from "preact";

export const CloseButton: FunctionalComponent<
  JSX.IntrinsicElements["button"]
> = ({ className, ...props }) => {
  return (
    <button className={cx(closeButtonClassName, className)} {...props}>
      <span>✕</span>
    </button>
  );
};
