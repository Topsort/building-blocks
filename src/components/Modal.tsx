import { CloseButton } from "@components/CloseButton";
import {
  modalClassName,
  modalHideClassName,
  modalShowClassName,
} from "@constants";
import { CustomText, Style } from "@types";
import cx from "classnames";
import { h, FunctionalComponent } from "preact";

// TODO(christopherbot) add overlay behind modal and focus trap
export const Modal: FunctionalComponent<{
  style?: Style;
  text?: CustomText;
  onClose: () => void;
  isOpen: boolean;
}> = ({ style, children, onClose, isOpen }) => {
  return (
    <div
      role="dialog"
      aria-modal
      className={cx(style?.modal?.className, {
        [modalClassName]: !style?.modal?.replace,
        [modalHideClassName]: !isOpen,
        [modalShowClassName]: isOpen,
      })}
    >
      <CloseButton onClick={onClose} />
      {children}
    </div>
  );
};
