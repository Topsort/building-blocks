import cx from "classnames";
import { h, FunctionalComponent, JSX } from "preact";

import "./style.css";

export const Link: FunctionalComponent<JSX.IntrinsicElements["a"]> = ({
  children,
  className,
  ...props
}) => {
  return (
    <a
      className={cx("ts-link ts-text-primary", className?.toString())}
      target="_blank"
      rel="noopener noreferrer"
      {...props}
    >
      {children}
    </a>
  );
};
