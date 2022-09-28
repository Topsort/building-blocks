import { Button } from "@components/Button";
import { Summary } from "@components/CampaignCreation/Summary";
import { Select } from "@components/Select";
import { h, FunctionalComponent } from "preact";

import { useCampaignCreation } from "./context";

export const Confirm: FunctionalComponent = () => {
  const { state, dispatch } = useCampaignCreation();
  const { paymentMethods } = state;

  return (
    <div className="ts-campaign-creation__content ts-space-y-8">
      <div className="ts-space-y-8">
        <Summary imgSrc="https://picsum.photos/76" showTargetingText />
        <div className="ts-space-y-2">
          <span className="ts-block ts-text-md ts-font-medium">
            Payment method
          </span>
          {/*
           * TODO(christopherbot) placeholder until we build a picker
           * and/or finalize how payments will work.
           */}
          <Select
            options={[1, 2, 3]}
            optionRenderer={(option) => <div>{option}</div>}
          />
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
            **** **** **** {paymentMethods[0]?.card?.last4}
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
          onClick={() => {
            dispatch({ type: "campaign launched" });
          }} // ToDo: save campaign
        >
          Launch
        </Button>
      </div>
    </div>
  );
};
