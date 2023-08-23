import { FunctionalComponent } from "preact";

import { Dropdown } from ".";
import "./style.css";

type DateRangeOption =
  | "today"
  | "last-7-days"
  | "last-30-days"
  | "last-60-days";

const getOptionDuration = (option: DateRangeOption) => {
  switch (option) {
    case "today": {
      return 1;
    }
    case "last-7-days": {
      return 7;
    }
    case "last-30-days": {
      return 30;
    }
    case "last-60-days": {
      return 60;
    }
  }
};

const getOptionLabel = (option: DateRangeOption) => {
  switch (option) {
    case "today":
      return "Today";
    case "last-7-days":
      return "Last 7 days";
    case "last-30-days":
      return "Last 30 days";
    case "last-60-days":
      return "Last 60 days";
  }
};

const dateRangeOptionsList: DateRangeOption[] = [
  "today",
  "last-7-days",
  "last-30-days",
  "last-60-days",
];

function getOptionDates(option: DateRangeOption) {
  const today = new Date();
  const dateOffset = 24 * 60 * 60 * 1000 * (getOptionDuration(option) + 1);
  const startDate = new Date(today.getTime() - dateOffset);
  return { startDate, endDate: today };
}

export const DateDropdown: FunctionalComponent<{
  onOptionSelected: (startDate: Date, endDate: Date) => void;
}> = ({ onOptionSelected }) => {
  const onOptionClicked = (optionClicked: DateRangeOption) => {
    const selectedDates = getOptionDates(optionClicked);
    onOptionSelected(selectedDates.startDate, selectedDates.endDate);
  };

  const options = dateRangeOptionsList.map((option) => {
    return { value: option, label: getOptionLabel(option) };
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
