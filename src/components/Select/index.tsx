import { Icon } from "@components/Icon";
import { Portal } from "@components/Portal";
import {
  autoUpdate,
  useClick,
  useDismiss,
  useFloating,
  useInteractions,
  useListNavigation,
  useRole,
} from "@floating-ui/react";
import { PropsWithChildren } from "@types";
import cx from "classnames";
import { FunctionalComponent, VNode, Fragment } from "preact";
import { MutableRef, useEffect, useRef, useState } from "preact/hooks";

import "./style.css";

interface SelectProps<T> {
  value?: T;
  options: Array<T>;
  onChange?: (option: T) => void;
  optionRenderer?: (
    option: T,
    optionProps: { active: boolean; selected: boolean; index: number }
  ) => VNode;
  selectRenderer?: (selectedOption: T | null) => VNode;
}

export const Select = <T extends boolean | number | string | Date | object>({
  value,
  options,
  onChange,
  optionRenderer,
  selectRenderer,
}: PropsWithChildren<SelectProps<T>>) => {
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(() => {
    /*
      TODO(samet): Write a function to check equality of objects.
      JSON.stringify is limited, and it doesn't work correctly if the orders
      of the properties are different.
    */
    const valueIndex = options.findIndex(
      (val) => JSON.stringify(value) === JSON.stringify(val)
    );

    return valueIndex === -1 ? null : valueIndex;
  });
  const listRef = useRef<Array<HTMLElement | null>>([]);
  const { x, y, reference, floating, context } = useFloating({
    open,
    onOpenChange: setOpen,
    whileElementsMounted: autoUpdate,
  });
  const { getReferenceProps, getFloatingProps, getItemProps } = useInteractions(
    [
      useClick(context),
      useDismiss(context),
      useRole(context, { role: "listbox" }),
      useListNavigation(context, {
        listRef,
        activeIndex,
        selectedIndex,
        onNavigate: setActiveIndex,
      }),
    ]
  );
  const selectedOption = selectedIndex !== null ? options[selectedIndex] : null;

  const handleSelect = (index: number) => {
    setSelectedIndex(index);
    setOpen(false);
    setActiveIndex(null);
    onChange?.(options[index]);
  };

  useEffect(() => {
    if (activeIndex !== null) {
      setTimeout(() => {
        listRef.current[activeIndex]?.focus();
      }, 0);
    }
  }, [activeIndex]);

  return (
    <Fragment>
      <button
        {...getReferenceProps({
          ref: reference,
          className: "ts-select-container",
        })}
      >
        {selectRenderer
          ? selectRenderer(selectedOption)
          : selectedOption === null
            ? "None selected"
            : JSON.stringify(selectedOption)}
        <Icon
          name="arrow-up-1-linear"
          className={cx({
            "ts-rotate-180": !open,
          })}
        />
      </button>
      <Portal target={document.body}>
        {open && (
          <div
            {...getFloatingProps({
              ref: floating,
              className: "ts-select-menu",
              style: {
                transform: `translate3d(${Math.round(x ?? 0)}px,${Math.round(
                  y ?? 0
                )}px,0)`,
                width:
                  context.refs.reference.current?.clientWidth ?? "fit-content",
                visibility: x === null || y === null ? "hidden" : "visible",
              },
              onKeyDown: (event: KeyboardEvent) => {
                if (event.key === "Tab") {
                  setOpen(false);
                }
              },
            })}
          >
            {options.map((option, index) => {
              const active = activeIndex === index;
              const selected = selectedIndex === index;

              return (
                <Option
                  key={index}
                  index={index}
                  active={active}
                  selected={selected}
                  handleSelect={handleSelect}
                  getItemProps={getItemProps}
                  listRef={listRef}
                >
                  {optionRenderer ? (
                    optionRenderer(option, { active, selected, index })
                  ) : (
                    <div>{JSON.stringify(option)}</div>
                  )}
                </Option>
              );
            })}
          </div>
        )}
      </Portal>
    </Fragment>
  );
};

const Option: FunctionalComponent<{
  index: number;
  active: boolean;
  selected: boolean;
  handleSelect: (index: number) => void;
  getItemProps: (userProps?: any) => Record<string, unknown>;
  listRef: MutableRef<Array<HTMLElement | null>>;
  children: VNode;
}> = ({
  index,
  active,
  selected,
  handleSelect,
  getItemProps,
  listRef,
  children,
}) => {
    const handleClick = () => {
      handleSelect(index);
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Enter") {
        event.preventDefault();
        handleSelect(index);
      } else if (event.key === " ") {
        event.preventDefault();
      }
    };

    const handleKeyUp = (event: KeyboardEvent) => {
      if (event.key === " ") {
        handleSelect(index);
      }
    };

    return (
      <div
        {...getItemProps({
          className: cx("ts-select-option", {
            "ts-select-option--active": active,
            "ts-select-option--selected": selected,
          }),
          role: "option",
          "aria-selected": selected,
          tabIndex: active ? 1 : 0,
          ref: (node: HTMLDivElement | null) => (listRef.current[index] = node),
          onClick: handleClick,
          onKeyDown: handleKeyDown,
          onKeyUp: handleKeyUp,
        })}
      >
        {children}
        {selected && (
          <Icon name="checkmark" width={10} height={8} viewBox="0 0 10 8" />
        )}
      </div>
    );
  };
