import { h, FunctionalComponent } from "preact";

export const Switch: FunctionalComponent = () => {
  return (
    <label class="ts-switch" tabIndex={0}>
      <input type="checkbox" />
      <span class="ts-switch-track" />
    </label>
  );
};
