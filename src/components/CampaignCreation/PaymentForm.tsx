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
import {
  StripeCardCvcElementChangeEvent,
  StripeCardExpiryElementChangeEvent,
  StripeCardNumberElement,
  StripeCardNumberElementChangeEvent,
} from "@stripe/stripe-js";
import { getStripe } from "@utils/stripe";
import cx from "classnames";
import { Fragment, h, JSX } from "preact";
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

type CardElement = "number" | "expiry" | "cvc";

type ErrorCode =
  | "invalid number"
  | "invalid expiry"
  | "invalid cvc"
  | "create payment method";

const initialErrorCodesByType = {
  number: null,
  expiry: null,
  cvc: null,
  api: null,
};

const errorText = {
  invalidNumber: "Invalid card number.",
  invalidExpiry: "Invalid expiration date.",
  invalidCvc: "Invalid CVC.",
  tryWithANewOne: "Please try with a new one.",
  tryAgain: "Please try again.",
  createPaymentMethod: "Failed to save payment method.",
};

const StripePaymentForm = () => {
  const { dispatch } = useCampaignCreation();
  const stripe = useStripe();
  const elements = useElements();
  const [loadingElements, setLoadingElements] = useState<
    Record<CardElement, boolean>
  >({
    number: true,
    expiry: true,
    cvc: true,
  });
  const [errorCodesByType, setErrorCodesByType] = useState<
    Record<CardElement | "api", ErrorCode | null>
  >(initialErrorCodesByType);
  const [isSavingCard, setIsSavingCard] = useState(false);

  const isStripeLoading =
    !stripe ||
    !elements ||
    Object.values(loadingElements).some((isLoading) => isLoading);

  const onSubmit = async (event: JSX.TargetedEvent<HTMLFormElement, Event>) => {
    event.preventDefault();
    if (isStripeLoading) return;

    setIsSavingCard(true);
    setErrorCodesByType((prev) => ({ ...prev, api: null }));

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
        setErrorCodesByType((prev) => ({ ...prev, number: "invalid number" }));
        cardNumberElement.focus();
      } else if (
        error.code === "incomplete_expiry" ||
        error.code === "invalid_expiry_month_past" ||
        error.code === "invalid_expiry_year" ||
        error.code === "invalid_expiry_year_past"
      ) {
        setErrorCodesByType((prev) => ({ ...prev, expiry: "invalid expiry" }));
        cardExpiryElement.focus();
      } else if (error.code === "incomplete_cvc") {
        setErrorCodesByType((prev) => ({ ...prev, cvc: "invalid cvc" }));
        cardCvcElement.focus();
      } else {
        setErrorCodesByType((prev) => ({
          ...prev,
          api: "create payment method",
        }));
      }

      setIsSavingCard(false);
      return;
    }

    setErrorCodesByType(initialErrorCodesByType);

    // TODO(christopherbot) call Central Services here to save card in our db
    setIsSavingCard(false);
    dispatch({ type: "payment method saved" });
  };

  const messagesByErrorCode: Record<ErrorCode, string> = {
    "invalid number": errorText.invalidNumber,
    "invalid expiry": errorText.invalidExpiry,
    "invalid cvc": errorText.invalidCvc,
    "create payment method": errorText.createPaymentMethod,
  };

  const errorCodes = Object.values(errorCodesByType).filter(
    (code): code is Exclude<typeof code, null> => code !== null
  );

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
              "ts-stripe-element--error": !!errorCodesByType.number,
            })}
          >
            <CardNumberElement
              onReady={(element: StripeCardNumberElement) => {
                setLoadingElements((prev) => ({ ...prev, number: false }));
                element.focus();
              }}
              onChange={(event: StripeCardNumberElementChangeEvent) => {
                setErrorCodesByType((prev) => ({
                  ...prev,
                  number: event.error ? "invalid number" : null,
                  api: null,
                }));
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
                "ts-stripe-element--error": !!errorCodesByType.expiry,
              })}
            >
              <CardExpiryElement
                onReady={() =>
                  setLoadingElements((prev) => ({ ...prev, expiry: false }))
                }
                onChange={(event: StripeCardExpiryElementChangeEvent) => {
                  setErrorCodesByType((prev) => ({
                    ...prev,
                    expiry: event.error ? "invalid expiry" : null,
                    api: null,
                  }));
                }}
                options={{ style: stripeElementStyle }}
              />
            </div>
          </label>
          <label className="ts-w-full">
            CVC
            <div
              className={cx("ts-stripe-element", {
                "ts-stripe-element--error": !!errorCodesByType.cvc,
              })}
            >
              <CardCvcElement
                onReady={() =>
                  setLoadingElements((prev) => ({ ...prev, cvc: false }))
                }
                onChange={(event: StripeCardCvcElementChangeEvent) => {
                  setErrorCodesByType((prev) => ({
                    ...prev,
                    cvc: event.error ? "invalid cvc" : null,
                    api: null,
                  }));
                }}
                options={{ style: stripeElementStyle }}
              />
            </div>
          </label>
        </div>
        {errorCodes.length > 0 && (
          <div className="ts-payment-form-error ts-space-x-4">
            <div className="ts-payment-form-error__icon">
              <Icon name="info-circle-bold" />
            </div>
            <div className="ts-payment-form-error__list">
              <ul>
                {errorCodesByType.api ? (
                  <li>
                    {messagesByErrorCode[errorCodesByType.api]}{" "}
                    {errorText.tryAgain}
                  </li>
                ) : (
                  errorCodes.map((errorCode) => (
                    <li key={errorCode}>
                      {messagesByErrorCode[errorCode]}
                      {errorCodes.length === 1 && (
                        <Fragment> {errorText.tryWithANewOne}</Fragment>
                      )}
                    </li>
                  ))
                )}
              </ul>
              {errorCodes.length > 1 && !errorCodesByType.api && (
                <span>{errorText.tryAgain}</span>
              )}
            </div>
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
