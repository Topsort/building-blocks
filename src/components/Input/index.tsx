import cx from "classnames";
import { h, FunctionalComponent, JSX } from "preact";

import "./style.css";

export const RangeInput: FunctionalComponent<
  JSX.IntrinsicElements["input"]
> = ({ className, ...props }) => (
  <input
    type="range"
    className={cx("ts-input ts-draggable", className)}
    {...props}
  />
);
