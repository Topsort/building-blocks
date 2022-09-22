import { Button } from "@components/Button";
import { h } from "preact";

import { useCampaignCreation } from "./context";

export const PaymentForm = () => {
  const { dispatch } = useCampaignCreation();
  return (
    <div className="ts-campaign-creation__content ts-justify-between ts-space-y-8">
      <span>Payment Form</span>
      <span>TODO</span>
      <div className="ts-campaign-creation__footer ts-space-x-2">
        <Button
          variant="outlined"
          onClick={(event) => {
            event.preventDefault();
            dispatch({ type: "payment form back button clicked" });
          }}
        >
          Back
        </Button>
        <Button
          onClick={() => void dispatch({ type: "payment method saved" })}
          variant="contained"
        >
          Save
        </Button>
      </div>
    </div>
  );
};
