import { Stripe } from "@stripe/stripe-js";
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
