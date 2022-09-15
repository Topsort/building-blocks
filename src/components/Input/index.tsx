import { Tooltip, TooltipProps } from "@components/Tooltip";
import cx from "classnames";
import { h, FunctionalComponent, JSX } from "preact";
import { useRef } from "preact/compat";

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

export const RangeInputWithTooltip: FunctionalComponent<
  JSX.IntrinsicElements["input"] & { tooltipProps: TooltipProps }
> = ({ className, tooltipProps, ...props }) => {
  const rangeRef = useRef<HTMLInputElement>(null);
  const leftOffset = (() => {
    if (!rangeRef.current) {
      return 0;
    }

    const min = Number(props.min) || 0;
    const max = Number(props.max) || 0;
    const val = Number(props.value) || min;
    const ratio = (val - min) / (max - min);
    const thumbSize =
      parseFloat(
        getComputedStyle(rangeRef.current).getPropertyValue("--thumb-size")
      ) * 16;

    return ratio * (rangeRef.current.offsetWidth - thumbSize) + thumbSize / 2;
  })();

  return (
    <Tooltip {...tooltipProps} leftOffset={leftOffset}>
      <input
        type="range"
        ref={rangeRef}
        className={cx("ts-input ts-draggable", className)}
        {...props}
      />
    </Tooltip>
  );
};
