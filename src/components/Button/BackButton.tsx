import { Icon } from "@components/Icon";
import cx from "classnames";
import { h, FunctionalComponent, JSX } from "preact";

import { Button } from "./Button";

export const BackButton: FunctionalComponent<
  JSX.IntrinsicElements["button"]
> = ({ className, ...props }) => {
  return (
    <Button
      className={cx("ts-back-button", className?.toString())}
      variant="inline"
      {...props}
    >
      <Icon name="arrow-circle-up-bold" title="Back" />
    </Button>
  );
};
