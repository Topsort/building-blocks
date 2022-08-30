import { h, FunctionalComponent, JSX } from "preact";
import { useMemo } from "preact/hooks";

type A11yProps = {
  "aria-labelledby"?: string;
  "aria-describedby"?: string;
};

export type SvgProps = JSX.IntrinsicElements["svg"] & {
  description?: string;
};

let numId = 0;

export const Svg: FunctionalComponent<SvgProps> = ({
  title,
  description,
  children,
  fill = "none",
  ...props
}) => {
  const id = useMemo(() => numId++, []);
  const a11yProps: A11yProps = {};
  const titleId = `ts-svg-title-id-${title}-${id}`;
  const descriptionId = `ts-svg-description-id-${description}-${id}`;

  if (title) {
    a11yProps["aria-labelledby"] = titleId;
  }
  if (description) {
    a11yProps["aria-describedby"] = descriptionId;
  }

  return (
    <div className="ts-svg-wrapper">
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill={fill}
        role="img"
        xmlns="http://www.w3.org/2000/svg"
        {...a11yProps}
        {...props}
      >
        {title && <title id={titleId}>{title}</title>}
        {description && <desc id={descriptionId}>{description}</desc>}
        {children}
      </svg>
    </div>
  );
};
