import { Button } from "@components/Button";
import { Icon } from "@components/Icon";
import cx from "classnames";
import { h, FunctionalComponent, JSX } from "preact";
import { useEffect, useRef } from "preact/compat";

import "./style.css";
import { calculateTextWidth } from "./validations";

export type InputProps = Omit<JSX.IntrinsicElements["input"], "onInput"> & {
  after?: string;
  before?: string;
  inputFilter?: (value: string) => string;
  /*
    NOTE (samet)
    Here, we omit the original "onInput" event listener of "input",
    and define our custom "onInput".
    The reason is that our internal input listener listens "input",
    performs some operations, and then calls the provided "onInput"
    listener. However, the code becomes unnecessarily messy if we
    use the original onInput.
    In this way, we pass only string, not the event itself.
    It is and will probably be enough for our use cases.
  */
  onInput?: (value: string) => void;
  hasBorder?: boolean;
  showArrowButtons?: boolean;
};

export const Input: FunctionalComponent<InputProps> = ({
  after,
  before,
  className,
  onInput,
  inputFilter,
  placeholder,
  type = "text",
  value,
  hasBorder = true,
  showArrowButtons = true,
  ...props
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const afterRef = useRef<HTMLInputElement>(null);
  const beforeRef = useRef<HTMLInputElement>(null);
  const innerWrapperRef = useRef<HTMLDivElement>(null);
  const buttonContainerRef = useRef<HTMLDivElement>(null);

  /*
    NOTE (samet)
    This effect calculates the maximum width of the "input".
    It depends on the width of "after"/"before" elements.
  */
  useEffect(() => {
    if (!inputRef.current) {
      return;
    }
    let width = 0; // the width except "input" element
    if (afterRef.current) {
      width += afterRef.current.clientWidth;
    }
    if (beforeRef.current) {
      width += beforeRef.current.clientWidth;
    }
    inputRef.current.style.maxWidth = `calc(100% - ${width}px)`;
  }, [after, before]);

  useEffect(() => {
    updateWidth();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [placeholder, value]);

  /*
    NOTE (samet)
    This effect calculates the maximum width of the inner wrapper.
    The inner wrapper contains "after", "before" and the native
    "input" element.
  */
  useEffect(() => {
    if (!innerWrapperRef.current) {
      return;
    }
    innerWrapperRef.current.style.maxWidth = `calc(100% - ${
      buttonContainerRef.current?.clientWidth ?? 0
    }px)`;
  }, [type]);

  const updateWidth = () => {
    if (!inputRef.current) {
      return;
    }
    const valueStr = String(inputRef.current.value);
    const width = calculateTextWidth(
      valueStr.length > 0 ? valueStr : placeholder?.toString() ?? "",
      getComputedStyle(inputRef.current).font
    );
    inputRef.current.style.width = `${width}px`;
  };

  /*
    NOTE (samet)
    This is an internal input event listener.

    At each input, it applies the given filter on the current input
    if there is any.

    It recalculates the width. Then, it pass the filtered value
    to the specified onInput function.

    The width calculation MUST be right after the value change.
    Otherwise, we will see sudden shifts. The reason is that
    the width of the "input" is smaller than the width of the content
    for a short period of time if we don't set the width immediately.
  */
  const onInputInternal = () => {
    const currentValue = inputRef.current?.value;
    if (!inputFilter || !inputRef.current) {
      updateWidth();
      onInput?.(currentValue ?? "");
      return;
    }

    const cleanedValue = inputFilter(inputRef.current.value);
    inputRef.current.value = cleanedValue;
    updateWidth();
    onInput?.(cleanedValue);
  };

  return (
    <div
      className={cx(
        "ts-input-wrapper",
        hasBorder && "ts-input-wrapper__border"
      )}
    >
      <div className="ts-input-inner-wrapper" ref={innerWrapperRef}>
        {before && (
          <span className="ts-input__before" ref={beforeRef}>
            {before}{" "}
          </span>
        )}
        <input
          ref={inputRef}
          value={value}
          placeholder={placeholder}
          className={cx("ts-input", className?.toString())}
          onInput={onInputInternal}
          type={type}
          {...props}
        />
        {after && (
          <span className="ts-input__after" ref={afterRef}>
            {" "}
            {after}
          </span>
        )}
      </div>
      {type === "number" && showArrowButtons && (
        <div className="ts-input__button-container" ref={buttonContainerRef}>
          <Button
            type="button"
            variant="text"
            onClick={() => {
              if (inputRef.current) {
                inputRef.current.stepUp();
                onInputInternal();
              }
            }}
          >
            <Icon
              name="arrow-down-bold"
              className="ts-rotate-180"
              width="20"
              height="20"
            />
          </Button>
          <Button
            type="button"
            variant="text"
            onClick={() => {
              if (inputRef.current) {
                inputRef.current.stepDown();
                onInputInternal();
              }
            }}
          >
            <Icon name="arrow-down-bold" width="20" height="20" />
          </Button>
        </div>
      )}
    </div>
  );
};
