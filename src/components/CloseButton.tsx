import { Button } from "@components/Button";
import { closeButtonClassName } from "@constants";
import cx from "classnames";
import { h, FunctionalComponent, JSX } from "preact";

export const CloseButton: FunctionalComponent<
  JSX.IntrinsicElements["button"]
> = ({ className, ...props }) => {
  return (
    <Button
      className={cx(closeButtonClassName, className)}
      variant="text"
      {...props}
    >
      ✕
    </Button>
  );
};
