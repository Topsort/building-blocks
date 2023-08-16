import { FunctionalComponent } from "preact";
import { useState } from "preact/hooks";

import "./style.css";

export const Switch: FunctionalComponent = () => {
  const [isChecked, setIsChecked] = useState(false);
  const toggleSwitch = () => setIsChecked((prev) => !prev);

  return (
    <label class="ts-switch">
      <input
        type="checkbox"
        checked={isChecked}
        onChange={() => toggleSwitch()}
        onKeyPress={(event) => {
          if (event.key === "Enter") {
            toggleSwitch();
          }
        }}
      />
      <span class="ts-switch-track" />
    </label>
  );
};
