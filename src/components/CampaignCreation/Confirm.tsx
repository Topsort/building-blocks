import { Button } from "@components/Button";
import { h, FunctionalComponent } from "preact";

import { useCampaignCreation } from "./context";

export const Confirm: FunctionalComponent = () => {
  const { state, dispatch } = useCampaignCreation();
  const { dailyBudget, durationDays } = state;

  return (
    <div className="ts-campaign-creation__content ts-space-y-8">
      <div className="ts-space-y-8">
        <div className="ts-callout ts-flex ts-items-center ts-space-x-4">
          <img
            className="ts-product-image ts-product-image--md"
            src="https://picsum.photos/76"
          />
          <span className="ts-font-medium">Too faced hangover primer</span>
        </div>
        <div className="ts-space-y-2">
          <span className="ts-block ts-text-md ts-font-medium">
            Budget and duration
          </span>
          <span className="ts-block ts-text-sm ts-font-medium">
            ${dailyBudget} over {durationDays} days.
          </span>
          <span className="ts-block ts-min-roas">
            Your minimum return on ad spend is <span>4x</span>.
          </span>
        </div>
        <div className="ts-space-y-2">
          <span className="ts-block ts-text-md ts-font-medium">
            Payment method
          </span>
          {/*
           * TODO(christopherbot) placeholder until we build a picker
           * and/or finalize how payments will work.
           */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              border: "1px solid #cecece",
              height: "3rem",
              padding: "0 1rem",
              borderRadius: "0.75rem",
            }}
          >
            **** **** **** 1234
          </div>
          <Button
            variant="inline"
            onClick={() =>
              void dispatch({ type: "add new payment method button clicked" })
            }
          >
            + Add new payment method
          </Button>
        </div>
      </div>
      <div className="ts-campaign-creation__footer ts-space-x-2">
        <Button
          variant="outlined"
          onClick={() => dispatch({ type: "confirm back button clicked" })}
        >
          Back
        </Button>
        <Button
          variant="contained"
          onClick={() => console.log("TODO: Launch campaign")}
        >
          Launch
        </Button>
      </div>
    </div>
  );
};
