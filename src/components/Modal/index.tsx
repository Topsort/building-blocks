import { CloseButton } from "@components/Button";
import cx from "classnames";
import { h, FunctionalComponent } from "preact";
import { useEffect, useRef } from "preact/hooks";

import "./style.css";

export const ModalHeading: FunctionalComponent = ({ children }) => {
  return <h2 className="ts-modal-heading">{children}</h2>;
};

export const ModalContent: FunctionalComponent<{ height?: string }> = ({
  children,
  height = "30rem",
}) => {
  return (
    <div className="ts-modal-content ts-scroll" style={{ height }}>
      {children}
    </div>
  );
};

// TODO(christopherbot) add overlay behind modal, focus trap, and outside click to close
export const Modal: FunctionalComponent<{
  onClose: () => void;
  isOpen: boolean;
}> = ({ children, onClose, isOpen }) => {
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
      <CloseButton onClick={onClose} />
      {children}
    </div>
  );
};
