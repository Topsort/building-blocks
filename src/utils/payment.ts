import { PaymentMethod } from "@api/types";
import {
  PaymentMethod as StripePaymentMethod,
  Stripe,
} from "@stripe/stripe-js";
// Lazy load stripe. See:
// https://dev.to/stripe/importing-stripe-js-as-an-es-module-1ni#defer-loading-stripejs
import { loadStripe } from "@stripe/stripe-js/pure";

let stripePromise: Promise<Stripe | null>;

export const getStripe = () => {
  if (!stripePromise) {
    stripePromise = loadStripe(STRIPE_PUBLIC_KEY);
  }
  return stripePromise;
};

export const formatPaymentMethod = (
  paymentMethod: StripePaymentMethod
): PaymentMethod => {
  if (paymentMethod.card) {
    return {
      id: paymentMethod.id,
      provider: "stripe",
      data: {
        id: paymentMethod.id,
        type: paymentMethod.type,
        brand: paymentMethod.card.brand,
        last4: paymentMethod.card.last4,
      },
    };
  }

  // TODO(christopherbot) add support for vendor balance as a payment method.
  throw new Error("Formatting non-card payment methods are not yet supported.");
};
