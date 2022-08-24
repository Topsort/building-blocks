import { CloseButton } from "@components/CloseButton";
import {
  modalClassName,
  modalHideClassName,
  modalShowClassName,
} from "@constants";
import { CustomText } from "@types";
import cx from "classnames";
import { h, FunctionalComponent } from "preact";

// TODO(christopherbot) add overlay behind modal and focus trap
export const Modal: FunctionalComponent<{
  text?: CustomText;
  onClose: () => void;
  isOpen: boolean;
}> = ({ children, onClose, isOpen }) => {
  return (
    <div
      role="dialog"
      aria-modal
      className={cx(modalClassName, {
        [modalHideClassName]: !isOpen,
        [modalShowClassName]: isOpen,
      })}
    >
      <CloseButton onClick={onClose} />
      {children}
    </div>
  );
};
