import cx from "classnames";
import { h, FunctionalComponent, VNode } from "preact";
import { useState } from "preact/hooks";

import "./style.css";

export const Tooltip: FunctionalComponent<{
  className?: string;
  content: VNode | string;
  align?: "top" | "bottom";
  alwaysShow?: boolean;
  light?: boolean;
}> = ({ className, children, content, align = "top", alwaysShow, light }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
      className={cx("ts-tooltip-wrapper", className)}
    >
      <div className="ts-flex">{children}</div>
      {(isOpen || alwaysShow) && (
        <div
          className={cx("ts-tooltip", {
            "ts-tooltip--light": light,
            "ts-tooltip--top": align === "top",
            "ts-tooltip--bottom": align === "bottom",
          })}
        >
          {content}
        </div>
      )}
    </div>
  );
};
