import { Tooltip, TooltipProps } from "@components/Tooltip";
import { remToPx } from "@utils/css-unit-converter";
import cx from "classnames";
import { FunctionalComponent, JSX } from "preact";
import {
  forwardRef,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "preact/compat";

import "./style.css";

const RangeInput = forwardRef<HTMLInputElement, JSX.IntrinsicElements["input"]>(
  ({ className, ...props }, ref) => (
    <input
      ref={ref}
      type="range"
      className={cx("ts-input ts-draggable", className?.toString())}
      {...props}
    />
  )
);

export const RangeInputWithTooltip: FunctionalComponent<
  JSX.IntrinsicElements["input"] & { tooltipProps: TooltipProps } & {
    setIsEditing: (value: boolean) => void;
  }
> = ({ setIsEditing, tooltipProps, ...props }) => {
  const [leftOffset, setLeftOffset] = useState<number | null>(null);
  const rangeRef = useRef<HTMLInputElement | null>(null);
  const observer = useRef<ResizeObserver | null>(null);

  const updateLeftOffset = () => {
    if (!rangeRef.current) {
      return;
    }
    const min = Number(rangeRef.current.min) || 0;
    const max = Number(rangeRef.current.max) || 0;
    const val = Number(rangeRef.current.value) || min;
    const ratio = (val - min) / (max - min);
    const percentage = ratio * 100;
    const thumbSize = remToPx(
      getComputedStyle(rangeRef.current).getPropertyValue("--thumb-size")
    );
    rangeRef.current.style.backgroundSize = `${percentage}% 100%`;
    const offsetWidth = rangeRef.current.offsetWidth;

    const calculatedLeftOffset =
      ratio * (offsetWidth - thumbSize) + thumbSize / 2 - offsetWidth / 2;

    if (
      typeof calculatedLeftOffset === "number" &&
      !isNaN(calculatedLeftOffset)
    ) {
      setLeftOffset(calculatedLeftOffset);
    } else {
      setLeftOffset(null);
    }
  };

  const ref = useCallback((node: HTMLInputElement | null) => {
    rangeRef.current = node;
    if (node) {
      if (!observer.current) {
        observer.current = new ResizeObserver(() => {
          updateLeftOffset();
        });
      }
      observer.current.observe(node);
      updateLeftOffset();
    } else {
      observer.current?.disconnect();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    updateLeftOffset();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.value, props.min, props.max]);

  return (
    <Tooltip
      {...tooltipProps}
      hidden={tooltipProps.hidden || leftOffset === null}
      offsetOptions={{
        ...(leftOffset !== null && { crossAxis: leftOffset }),
      }}
      onClick={() => {
        setIsEditing(true);
      }}
      onClickAway={() => setIsEditing(false)}
    >
      <RangeInput ref={ref} {...props} />
    </Tooltip>
  );
};
