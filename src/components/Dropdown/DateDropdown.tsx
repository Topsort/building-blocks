import { FunctionalComponent } from "preact";

import { Dropdown } from ".";
import "./style.css";

const dateOptionsDict = {
  today: { label: "Today", duration: 1 },
  "last-7-days": { label: "Last 7 days", duration: 7 },
  "last-30-days": { label: "Last 30 days", duration: 30 },
  "last-60-days": { label: "Last 60 days", duration: 60 },
};

type DateRangeOption = keyof typeof dateOptionsDict;

function getOptionDates(option: DateRangeOption) {
  const today = new Date();
  const dateOffset =
    24 * 60 * 60 * 1000 * (dateOptionsDict[option].duration + 1);
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
