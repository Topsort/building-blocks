import Portal from "@components/Portal";
import { OffsetOptions, Placement } from "@floating-ui/core/src/types";
import { computePosition, offset, autoUpdate } from "@floating-ui/dom";
import cx from "classnames";
import { h, FunctionalComponent, VNode } from "preact";
import { useCallback, useLayoutEffect, useRef, useState } from "preact/hooks";

import "./style.css";

export type TooltipProps = {
  className?: string;
  content: VNode | string;
  alwaysShow?: boolean;
  light?: boolean;
  style?: h.JSX.CSSProperties;
  offsetOptions?: OffsetOptions;
  placement?: Placement;
};

export const Tooltip: FunctionalComponent<TooltipProps> = ({
  className,
  children,
  content,
  alwaysShow,
  light,
  style,
  offsetOptions,
  placement = "top",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement | null>(null);
  const cleanupRef = useRef<(() => void) | null>(null);

  const updateTooltipPosition = () => {
    if (
      !wrapperRef.current ||
      !tooltipRef.current ||
      wrapperRef.current.offsetHeight === 0 ||
      wrapperRef.current.offsetWidth === 0
    ) {
      if (tooltipRef.current) {
        Object.assign(tooltipRef.current.style, {
          visibility: "hidden",
        });
      }
      return;
    }

    cleanupRef.current = autoUpdate(
      wrapperRef.current,
      tooltipRef.current,
      () => {
        if (wrapperRef.current && tooltipRef.current) {
          computePosition(wrapperRef.current, tooltipRef.current, {
            placement,
            middleware: [offset(offsetOptions)],
          }).then(({ x, y }) => {
            if (tooltipRef.current) {
              Object.assign(tooltipRef.current.style, {
                transform: `translate3d(${Math.round(x)}px,${Math.round(
                  y
                )}px,0)`,
                visibility: "visible",
              });
            }
          });
        }
      }
    );
  };

  const ref = useCallback((tooltipNode: HTMLDivElement | null) => {
    tooltipRef.current = tooltipNode;
    if (tooltipNode) {
      Object.assign(tooltipNode.style, {
        visibility: "hidden",
      });
      updateTooltipPosition();
    } else {
      cleanupRef.current?.();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useLayoutEffect(() => {
    updateTooltipPosition();
    return () => cleanupRef.current?.();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [offsetOptions, placement]);

  return (
    <div
      ref={wrapperRef}
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
      className={cx("ts-tooltip-wrapper", className)}
    >
      <div className="ts-flex">{children}</div>
      {(isOpen || alwaysShow) && (
        <Portal target={document.body}>
          <div
            ref={ref}
            className={cx("ts-tooltip", {
              "ts-tooltip--light": light,
              "ts-tooltip--top": placement === "top",
              "ts-tooltip--bottom": placement === "bottom",
            })}
            style={style}
          >
            {content}
          </div>
        </Portal>
      )}
    </div>
  );
};
