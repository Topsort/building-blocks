import { Button } from "@components/Button";
import { Icon } from "@components/Icon";
import {
  Elements,
  useStripe,
  useElements,
  CardNumberElement,
  CardExpiryElement,
  CardCvcElement,
} from "@stripe/react-stripe-js";
import { StripeCardNumberElement } from "@stripe/stripe-js";
import { getStripe } from "@utils/stripe";
import cx from "classnames";
import { h, JSX } from "preact";
import { useState } from "preact/hooks";

import { useCampaignCreation } from "./context";

const stripeElementStyle = {
  base: {
    color: "#272A47",
    fontSmoothing: "antialiased",
    fontSize: "16px",
    "::placeholder": {
      color: "#777777",
    },
  },
  invalid: {
    color: "#c62828",
    iconColor: "#c62828",
  },
};

type LoadingElement = "number" | "expiry" | "cvc";
type ErrorCode =
  | "invalid number"
  | "invalid expiry"
  | "invalid cvc"
  | "unknown";

const StripePaymentForm = () => {
  const { dispatch } = useCampaignCreation();
  const stripe = useStripe();
  const elements = useElements();
  const [loadingElements, setLoadingElements] = useState<
    Record<LoadingElement, boolean>
  >({
    number: true,
    expiry: true,
    cvc: true,
  });
  const [errorCode, setErrorCode] = useState<ErrorCode | null>(null);
  const [isSavingCard, setIsSavingCard] = useState(false);

  const isStripeLoading =
    !stripe ||
    !elements ||
    Object.values(loadingElements).some((isLoading) => isLoading);

  const onSubmit = async (event: JSX.TargetedEvent<HTMLFormElement, Event>) => {
    event.preventDefault();
    if (isStripeLoading) return;

    setIsSavingCard(true);
    setErrorCode(null);

    const cardNumberElement = elements.getElement("cardNumber");
    const cardExpiryElement = elements.getElement("cardExpiry");
    const cardCvcElement = elements.getElement("cardCvc");

    // Although these could technically be null, this guard is mostly to make
    // TypeScript happy since the isStripeLoading guard above already takes
    // care of the elements not being ready.
    if (!cardNumberElement || !cardExpiryElement || !cardCvcElement) return;

    /* eslint-disable-next-line */
    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: "card",
      card: cardNumberElement,
    });

    if (error) {
      if (
        error.code === "incomplete_number" ||
        error.code === "invalid_number"
      ) {
        setErrorCode("invalid number");
        cardNumberElement.focus();
      } else if (
        error.code === "incomplete_expiry" ||
        error.code === "invalid_expiry_month_past" ||
        error.code === "invalid_expiry_year" ||
        error.code === "invalid_expiry_year_past"
      ) {
        setErrorCode("invalid expiry");
        cardExpiryElement.focus();
      } else if (error.code === "incomplete_cvc") {
        setErrorCode("invalid cvc");
        cardCvcElement.focus();
      } else {
        setErrorCode("unknown");
      }

      setIsSavingCard(false);
      return;
    }

    // TODO(christopherbot) call Central Services here to save card in our db
    setIsSavingCard(false);
    dispatch({ type: "payment method saved" });
  };

  const getErrorMessage = () => {
    switch (errorCode) {
      case "invalid number":
        return "Invalid card number. Please try with a new one.";
      case "invalid expiry":
        return "Invalid expiration date. Please try with a new one.";
      case "invalid cvc":
        return "Invalid CVC. Please try with a new one.";
      case "unknown":
        return "Something went wrong, please try again.";
    }
  };

  return (
    <form
      className="ts-campaign-creation__content ts-space-y-8"
      onSubmit={onSubmit}
    >
      <div className="ts-space-y-4">
        <label className="ts-w-full">
          Card number
          <div
            className={cx("ts-stripe-element", {
              "ts-stripe-element--error": errorCode === "invalid number",
            })}
          >
            <CardNumberElement
              onReady={(element: StripeCardNumberElement) => {
                setLoadingElements((prev) => ({ ...prev, number: false }));
                element.focus();
              }}
              options={{ style: stripeElementStyle }}
            />
          </div>
        </label>
        <div className="ts-flex ts-w-full ts-space-x-4">
          <label className="ts-w-full">
            Expiration date
            <div
              className={cx("ts-stripe-element", {
                "ts-stripe-element--error": errorCode === "invalid expiry",
              })}
            >
              <CardExpiryElement
                onReady={() =>
                  setLoadingElements((prev) => ({ ...prev, expiry: false }))
                }
                options={{ style: stripeElementStyle }}
              />
            </div>
          </label>
          <label className="ts-w-full">
            CVC
            <div
              className={cx("ts-stripe-element", {
                "ts-stripe-element--error": errorCode === "invalid cvc",
              })}
            >
              <CardCvcElement
                onReady={() =>
                  setLoadingElements((prev) => ({ ...prev, cvc: false }))
                }
                options={{ style: stripeElementStyle }}
              />
            </div>
          </label>
        </div>
        {errorCode && (
          <div className="ts-payment-form-error ts-space-x-4">
            <div className="ts-payment-form-error__icon">
              <Icon name="info-circle-bold" />
            </div>
            <span>{getErrorMessage()}</span>
          </div>
        )}
      </div>
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
        <Button variant="contained" disabled={isStripeLoading || isSavingCard}>
          Save
        </Button>
      </div>
    </form>
  );
};

export const PaymentForm = () => {
  return (
    <Elements stripe={getStripe()}>
      <StripePaymentForm />
    </Elements>
  );
};
