import { Button } from "@components/Button";
import { Icon } from "@components/Icon";
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
      <Icon className="ts-rotate-45" name="plus" title="Close" />
    </Button>
  );
};
