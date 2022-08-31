import { CloseButton } from "@components/CloseButton";
import cx from "classnames";
import { h, FunctionalComponent } from "preact";

// TODO(christopherbot) add overlay behind modal and focus trap
export const Modal: FunctionalComponent<{
  onClose: () => void;
  isOpen: boolean;
}> = ({ children, onClose, isOpen }) => {
  return (
    <div
      role="dialog"
      aria-modal
      className={cx("ts-modal", {
        "ts-modal--hide": !isOpen,
        "ts-modal--show": isOpen,
      })}
    >
      <CloseButton onClick={onClose} />
      {children}
    </div>
  );
};
