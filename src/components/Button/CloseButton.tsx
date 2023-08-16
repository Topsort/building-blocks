import { Button } from "@components/Button";
import { Icon } from "@components/Icon";
import * as cx from "classnames";
import { FunctionalComponent, JSX } from "preact";

export const CloseButton: FunctionalComponent<
  JSX.IntrinsicElements["button"]
> = ({ className, ...props }) => {
  return (
    <Button
      className={cx("ts-close-button", className?.toString())}
      variant="text"
      {...props}
    >
      <Icon className="ts-rotate-45" name="plus" title="Close" />
    </Button>
  );
};
