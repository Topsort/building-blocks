import { Button } from "@components/Button";
import { Summary } from "@components/CampaignCreation/Summary";
import { h, FunctionalComponent } from "preact";

import { useCampaignCreation } from "./context";

export const Confirm: FunctionalComponent = () => {
  const { state, dispatch } = useCampaignCreation();
  const { dailyBudget, durationDays } = state;

  return (
    <div className="ts-campaign-creation__content ts-justify-between ts-space-y-8">
      <div className="ts-space-y-8">
        <Summary
          dailyBudget={dailyBudget}
          durationDays={durationDays}
          imgSrc="https://picsum.photos/76"
          showTargetingText
        />
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
          <Button variant="inline">+ Add new payment method</Button>
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
          onClick={() => {
            console.log("aca");
            dispatch({ type: "launch campaign" });
          }} // ToDo: save campaign
        >
          Launch
        </Button>
      </div>
    </div>
  );
};
