import { PaymentMethod } from "@api/types";
import { Button } from "@components/Button";
import { Select } from "@components/Select";
import { CampaignBudget, CampaignSummary } from "@components/common";
import { h, FunctionalComponent } from "preact";

import { useCampaignCreation } from "./context";
import { PaymentMethodIcon } from "./utils";

const FormattedPaymentMethod: FunctionalComponent<{
  paymentMethod: PaymentMethod;
}> = ({ paymentMethod }) => {
  if (paymentMethod.data.type !== "card") {
    return <span>payment method of type "{paymentMethod.data.type}"</span>;
  }

  return (
    <div className="ts-payment-method ts-space-x-2">
      <PaymentMethodIcon paymentMethod={paymentMethod} />
      <span>**** **** **** {paymentMethod.data.last4}</span>
    </div>
  );
};

export const Confirm: FunctionalComponent = () => {
  const { state, dispatch } = useCampaignCreation();
  const { paymentMethods, selectedPaymentMethodId } = state;
  const { dailyBudget, durationDays } = state;

  return (
    <div className="ts-campaign-creation__content ts-space-y-8">
      <div className="ts-space-y-8">
        <CampaignSummary
          productImageUrl="https://picsum.photos/76"
          name="Too faced hangover primer"
        />
        <CampaignBudget
          budget={dailyBudget}
          days={durationDays}
          showTargetingText
        />
        <div className="ts-space-y-2">
          <span className="ts-block ts-text-md ts-font-medium">
            Payment method
          </span>
          <Select
            value={paymentMethods.find(
              (paymentMethod) => paymentMethod.id === selectedPaymentMethodId
            )}
            options={paymentMethods}
            selectRenderer={(selectedOption) =>
              selectedOption ? (
                <FormattedPaymentMethod paymentMethod={selectedOption} />
              ) : (
                <span>Select a payment method</span>
              )
            }
            optionRenderer={(option) => (
              <FormattedPaymentMethod paymentMethod={option} />
            )}
            onChange={(option) =>
              dispatch({
                type: "payment method selected",
                payload: {
                  paymentMethod: option,
                },
              })
            }
          />
          <Button
            variant="inline"
            onClick={() =>
              dispatch({ type: "add new payment method button clicked" })
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
