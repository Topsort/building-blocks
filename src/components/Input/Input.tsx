import { remToPx } from "@utils/css-unit-converter";
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

export const Input: FunctionalComponent<
  Omit<JSX.IntrinsicElements["input"], "onInput"> & {
    after?: string;
    before?: string;
    inputFilter?: (value: string) => string;
    /*
      Here, we omit the original "onInput" event listener of "input",
      and define our custom "onInput".
      The reason is that our internal input listener listens "input",
      perform some operations, and then calls the provided "onInput"
      listener. However, the code becomes unnecessarily messy when we
      call original onInput.
      In this way, we pass only string, not the event itself.
      It is and will probably be enough for our use cases.
    */
    onInput?: (value: string) => void;
  }
> = ({
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
    This effect calculates the maximum width of the "input".
    It depends on the width of "after"/"before" elements, and
    the space (column-gap) between "input" and "after"/before.
  */
  useEffect(() => {
    let width = 0; // the width except "input" element
    if (afterRef.current) {
      width += afterRef.current.clientWidth + remToPx("0.3rem");
      // column-gap is 0.3rem. It is the space between "after" and "input"
    }
    if (beforeRef.current) {
      width += beforeRef.current.clientWidth + remToPx("0.3rem");
      // column-gap is 0.3rem. It is the space between "before" and "input"
    }
    if (inputRef.current) {
      inputRef.current.style.maxWidth = `calc(100% - ${width}px)`;
    }
  }, [after, before]);

  useEffect(() => {
    updateWidth();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [placeholder, value]);

  const updateWidth = () => {
    if (inputRef.current) {
      const valueStr = String(inputRef.current.value);
      const width = calculateTextWidth(
        valueStr.length > 0 ? valueStr : placeholder ?? "",
        getComputedStyle(inputRef.current).font
      );
      console.log(getComputedStyle(inputRef.current).maxWidth);
      inputRef.current.style.width = `${width}px`;
    }
  };

  /*
    This is an internal input event listener.

    At each input, it applies the given filter on the current input
    if there is any.

    It recalculates the width. Then, it pass the filtered value
    to the specified onInput function.

    The width calculation MUST be right after the value change.
    Otherwise, we will see sudden shifts. The reason is that
    the width of the "input" is smaller than the width of the content.
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
        <div className="ts-input__before" ref={beforeRef}>
          {before}{" "}
        </div>
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
        <div className="ts-input__after" ref={afterRef}>
          {" "}
          {after}
        </div>
      )}
    </div>
  );
};
