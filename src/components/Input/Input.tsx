import cx from "classnames";
import { h, FunctionalComponent, JSX } from "preact";
import { useEffect, useRef } from "preact/hooks";

const canvasContext = (() => {
  const canvas = document.createElement("canvas");
  return canvas.getContext("2d");
})();

const calculateTextWidth = (text: string, font: string): number => {
  if (canvasContext) {
    canvasContext.font = font;
  }
  return canvasContext?.measureText(text).width ?? 0;
};

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
};

export const Input: FunctionalComponent<InputProps> = ({
  after,
  before,
  className,
  onInput,
  inputFilter,
  placeholder,
  value,
  ...props
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const afterRef = useRef<HTMLInputElement>(null);
  const beforeRef = useRef<HTMLInputElement>(null);

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

  const updateWidth = () => {
    if (!inputRef.current) {
      return;
    }
    const valueStr = String(inputRef.current.value);
    const width = calculateTextWidth(
      valueStr.length > 0 ? valueStr : placeholder ?? "",
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
    <div className="ts-input-wrapper">
      {before && (
        <span className="ts-input__before" ref={beforeRef}>
          {before}{" "}
        </span>
      )}
      <input
        ref={inputRef}
        value={value}
        placeholder={placeholder}
        className={cx("ts-input", className)}
        onInput={onInputInternal}
        {...props}
      />
      {after && (
        <span className="ts-input__after" ref={afterRef}>
          {" "}
          {after}
        </span>
      )}
    </div>
  );
};
