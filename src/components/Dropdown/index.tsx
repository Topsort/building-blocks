import { Button } from "@components/Button";
import classnames from "classnames";
import { useState } from "preact/hooks";

import { ClickAwayListener } from "../ClickAwayListener";
import { Icon } from "../Icon";
import "./style.css";

type DropdownOption<T> = {
  value: T;
  label: string;
};

type DropdownProps<T> = {
  onOptionSelected: (option: DropdownOption<T>) => void;
  options: DropdownOption<T>[];
  defaultOption?: DropdownOption<T>;
  disabled?: boolean;
  dropdownClassname?: string;
  optionsClassname?: string;
  buttonClassname?: string;
};

export function Dropdown<T>({
  onOptionSelected,
  disabled,
  optionsClassname,
  options,
  defaultOption,
  buttonClassname,
}: DropdownProps<T>) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState<DropdownOption<T>>(
    defaultOption || options[0]
  );

  const onOptionClicked = (optionClicked: DropdownOption<T>) => {
    setSelectedOption(optionClicked);
    onOptionSelected(optionClicked);
    setDropdownOpen(false);
  };
  return (
    <ClickAwayListener
      onClickAway={() => {
        setDropdownOpen(false);
      }}
    >
      <div id="ts-dropdown-container" className="ts-dropdown-container">
        <Button
          id="ts-dropdown-button"
          variant="outlined"
          onClick={() => {
            if (!disabled) {
              setDropdownOpen(!dropdownOpen);
            }
          }}
          className={classnames("ts-space-x-2", buttonClassname)}
        >
          <span>{selectedOption.label}</span>
          <Icon
            name="arrow-up-1-linear"
            className="ts-rotate-180"
            width="15"
            height="15"
          />
        </Button>
        <div
          id="ts-dropdown-menu"
          className={classnames("ts-dropdown-menu", {
            "ts-hidden": !dropdownOpen,
          })}
        >
          {options.map((option, index) => {
            return (
              <Button
                key={index}
                variant="text"
                onClick={() => onOptionClicked(option)}
                selected={selectedOption === option}
                className={optionsClassname}
              >
                {option.label || option.value}{" "}
              </Button>
            );
          })}
        </div>
      </div>
    </ClickAwayListener>
  );
}
