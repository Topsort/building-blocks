import { PaymentMethod } from "@api/types";
import { Button } from "@components/Button";
import { Icon } from "@components/Icon";
import { Select } from "@components/Select";
import { CampaignBudget, CampaignSummary } from "@components/common";
import { useProductPromotion } from "@context";
import * as services from "@services/central-services/mock";
import { logger } from "@utils/logger";
import { h, FunctionalComponent } from "preact";
import { useState } from "preact/hooks";

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
  const { authToken, vendorId, currencyCode, state, dispatch } =
    useProductPromotion();
  const {
    productDataById,
    selectedProductId,
    paymentMethods,
    selectedPaymentMethodId,
    campaignCreation: { dailyBudget, durationDays },
  } = state;

  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);

  // TODO(christopherbot) improve progress state: e.g. what if
  // a user closes the modal while waiting for the api to repsond
  // and then re-opens the modal?
  const launchCampaign = async () => {
    setIsLoading(true);
    setHasError(false);

    const paymentMethod = paymentMethods.find(
      ({ id }) => id === selectedPaymentMethodId
    );

    if (!selectedProductId || !paymentMethod) {
      if (!selectedProductId) {
        logger.error("Cannot create campaign without a product selected.");
      }
      if (!paymentMethod) {
        logger.error(
          "Cannot create campaign without a payment method selected."
        );
      }
      setIsLoading(false);
      setHasError(true);
      return;
    }

    const productData = selectedProductId
      ? productDataById[selectedProductId]
      : null;

    const startDate = new Date();
    const endDate = new Date();
    endDate.setDate(startDate.getDate() + durationDays);

    try {
      const campaign = await services.createCampaign(authToken, vendorId, {
        productId: selectedProductId,
        name: `${productData?.name || selectedProductId} Campaign`,
        dailyBudget,
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
        paymentMethod,
        currencyCode,
      });

      dispatch({
        type: "campaign launched",
        payload: { campaign, productId: selectedProductId },
      });
    } catch (error) {
      logger.error("Failed to create campaign", error);
      setHasError(true);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="ts-campaign-creation__content ts-space-y-8">
      <div className="ts-space-y-8">
        <CampaignSummary />
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
        {hasError && (
          <span className="ts-flex ts-items-center ts-text-danger ts-space-x-2">
            <Icon name="info-circle-bold" />
            <span>Something went wrong.</span>
          </span>
        )}
      </div>
      <div className="ts-campaign-creation__footer ts-space-x-2">
        <Button
          variant="outlined"
          onClick={() =>
            dispatch({ type: "confirm campaign creation back button clicked" })
          }
        >
          Back
        </Button>
        <Button
          variant="contained"
          onClick={() => launchCampaign()}
          disabled={isLoading}
        >
          Launch
        </Button>
      </div>
    </div>
  );
};
