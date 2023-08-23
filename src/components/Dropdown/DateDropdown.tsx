import { FunctionalComponent } from "preact";

import { Dropdown } from ".";
import "./style.css";
import {
  DateRangeOption,
  getOptionDates,
  dateOptionsDict,
} from "@utils/datetime";

export const DateDropdown: FunctionalComponent<{
  onOptionSelected: (startDate: Date, endDate: Date) => void;
}> = ({ onOptionSelected }) => {
  const onOptionClicked = (optionClicked: DateRangeOption) => {
    const selectedDates = getOptionDates(optionClicked);
    onOptionSelected(selectedDates.startDate, selectedDates.endDate);
  };

  const options = Object.entries(dateOptionsDict).map(([key, option]) => {
    return { value: key as DateRangeOption, label: option.label };
  });
  const last7daysOption = options.find(
    (option) => option.value === "last-7-days"
  );

  return (
    <Dropdown
      buttonClassname="ts-date-dropdown-button"
      optionsClassname="ts-date-dropdown-options"
      defaultOption={last7daysOption}
      options={options}
      onOptionSelected={(option) => {
        onOptionClicked(option.value);
      }}
    />
  );
};
