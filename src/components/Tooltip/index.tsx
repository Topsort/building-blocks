import cx from "classnames";
import { h, FunctionalComponent, VNode } from "preact";
import { useState } from "preact/hooks";

import "./style.css";

export type TooltipProps = {
  className?: string;
  content: VNode | string;
  align?: "top" | "bottom";
  alwaysShow?: boolean;
  light?: boolean;
  leftOffset?: number;
};

export const Tooltip: FunctionalComponent<TooltipProps> = ({
  className,
  children,
  content,
  align = "top",
  alwaysShow,
  light,
  leftOffset,
}) => {
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
          style={{
            ...(typeof leftOffset !== "undefined" && { left: leftOffset }),
          }}
        >
          {content}
        </div>
      )}
    </div>
  );
};
