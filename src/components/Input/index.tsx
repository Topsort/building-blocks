import { Tooltip, TooltipProps } from "@components/Tooltip";
import cx from "classnames";
import { h, FunctionalComponent, JSX } from "preact";
import { forwardRef, useCallback, useRef, useState } from "preact/compat";

import "./style.css";

export const RangeInput: FunctionalComponent<JSX.IntrinsicElements["input"]> =
  forwardRef<HTMLInputElement, JSX.IntrinsicElements["input"]>(
    ({ className, ...props }, ref) => (
      <input
        ref={ref}
        type="range"
        className={cx("ts-input ts-draggable", className)}
        {...props}
      />
    )
  );

export const RangeInputWithTooltip: FunctionalComponent<
  JSX.IntrinsicElements["input"] & { tooltipProps: TooltipProps }
> = ({ tooltipProps, ...props }) => {
  const [leftOffset, setLeftOffset] = useState(0);
  const rangeRef = useRef<HTMLInputElement | null>(null);

  const updateLeftOffset = () => {
    if (!rangeRef.current) {
      return;
    }
    const min = Number(props.min) || 0;
    const max = Number(props.max) || 0;
    const val = Number(props.value) || min;
    const ratio = (val - min) / (max - min);
    const thumbSize =
      parseFloat(
        getComputedStyle(rangeRef.current).getPropertyValue("--thumb-size")
      ) * 16;

    setLeftOffset(
      ratio * (rangeRef.current.offsetWidth - thumbSize) + thumbSize / 2
    );
  };

  const ref = useCallback((node: HTMLInputElement | null) => {
    rangeRef.current = node;
    updateLeftOffset();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  updateLeftOffset();

  return (
    <Tooltip {...tooltipProps} style={{ left: leftOffset }}>
      <RangeInput ref={ref} {...props} />
    </Tooltip>
  );
};
