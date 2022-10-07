import { Tooltip, TooltipProps } from "@components/Tooltip";
import { remToPx } from "@utils/css-unit-converter";
import cx from "classnames";
import { h, FunctionalComponent, JSX } from "preact";
import {
  forwardRef,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "preact/compat";

import "./style.css";

export const RangeInput = forwardRef<
  HTMLInputElement,
  JSX.IntrinsicElements["input"]
>(({ className, ...props }, ref) => (
  <input
    ref={ref}
    type="range"
    className={cx("ts-input ts-draggable", className)}
    {...props}
  />
));

export const RangeInputWithTooltip: FunctionalComponent<
  JSX.IntrinsicElements["input"] & { tooltipProps: TooltipProps }
> = ({ tooltipProps, ...props }) => {
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
    const thumbSize = remToPx(
      getComputedStyle(rangeRef.current).getPropertyValue("--thumb-size")
    );
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
    >
      <RangeInput ref={ref} {...props} />
    </Tooltip>
  );
};

export const Input: FunctionalComponent<
  JSX.IntrinsicElements["input"] & {
    after?: string;
    before?: string;
  }
> = ({ after, before, className, placeholder, value, ...props }) => {
  const [width, afterBeforeWidth] = (() => {
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");
    if (context) {
      // TODO (samet): get font size and font family instead of hardcoding it
      context.font = "0.875rem Arial";
    }
    const text = value ? String(value) : placeholder ?? "";
    const afterBeforeText = `${after ? after : ""}${before ? before : ""}  `;
    return [
      /*
        NOTE (samet)
        The width of "W" character is added to the width of the text.
        Otherwise, when a new character is appended, we will see a sudden
        shift.
      */
      context?.measureText(`${text}W`).width ?? 0,
      context?.measureText(`${afterBeforeText}`).width ?? 0,
    ];
  })();

  console.log(afterBeforeWidth);
  return (
    <div className="ts-input-wrapper">
      {before && <span className="ts-input__before">{before} </span>}
      <input
        value={value}
        placeholder={placeholder}
        className={cx("ts-input", className)}
        {...props}
        style={{
          width: `${width}px`,
          // TODO (samet): adjust maxWidth and margins better
          maxWidth: `calc(100% - ${afterBeforeWidth}px)`,
        }}
      />
      {after && <span className="ts-input__after"> {after}</span>}
    </div>
  );
};
