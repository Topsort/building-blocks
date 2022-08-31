import { CloseButton } from "@components/CloseButton";
import cx from "classnames";
import { h, FunctionalComponent, VNode } from "preact";
import { useEffect, useRef } from "preact/hooks";

// TODO(christopherbot) add overlay behind modal and focus trap
export const Modal: FunctionalComponent<{
  heading: VNode | string;
  onClose: () => void;
  isOpen: boolean;
}> = ({ heading, children, onClose, isOpen }) => {
  const focusRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    // Bring focus into the modal upon opening it
    if (isOpen && focusRef.current) {
      focusRef.current.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    const onKeydown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };
    document.addEventListener("keydown", onKeydown);

    return () => {
      document.removeEventListener("keydown", onKeydown);
    };
  });

  return (
    <div
      role="dialog"
      aria-modal
      className={cx("ts-modal", {
        "ts-modal--hide": !isOpen,
        "ts-modal--show": isOpen,
      })}
      tabIndex={-1}
      ref={focusRef}
    >
      <div className="ts-modal-heading">
        <CloseButton onClick={onClose} />
        {typeof heading === "string" ? <h2>{heading}</h2> : heading}
      </div>
      <div className="ts-modal-content ts-scroll">{children}</div>
    </div>
  );
};
