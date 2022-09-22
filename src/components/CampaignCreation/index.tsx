import { ModalContent, ModalHeading } from "@components/Modal";
import { assertNever } from "@utils/assert-never";
import { getStripe } from "@utils/stripe";
import { h, FunctionalComponent } from "preact";
import { useEffect, useReducer } from "preact/hooks";

import { BudgetAndDuration } from "./BudgetAndDuration";
import { Confirm } from "./Confirm";
import { PaymentForm } from "./PaymentForm";
import { CampaignCreationContext } from "./context";
import {
  initialState,
  reducer,
  recommendedBudgetUSD,
  initialDurationDays,
} from "./state";
import "./style.css";

export const CampaignCreation: FunctionalComponent<{
  productId: string | null;
}> = ({ productId }) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { step, paymentMethods } = state;

  useEffect(() => {
    dispatch({
      type: "daily budget updated",
      payload: { amount: recommendedBudgetUSD },
    });
  }, [dispatch]);

  useEffect(() => {
    dispatch({
      type: "duration days updated",
      payload: { days: initialDurationDays },
    });
  }, [dispatch]);

  useEffect(() => {
    // TODO(christopherbot) fetch paymenth methods from Central Services here
    // Change this to be able to see the flow to the Confirm step
    // const fetchedPaymentMethods: any[] = [{}];
    const fetchedPaymentMethods: any[] = [];
    dispatch({
      type: "payment methods received",
      payload: { paymentMethods: fetchedPaymentMethods },
    });
  }, [dispatch]);

  useEffect(() => {
    if (!paymentMethods) {
      // To reduce load time later, load Stripe early if we know
      // the user will need to add a card
      getStripe();
    }
  }, [paymentMethods]);

  useEffect(() => {
    // If the modal for a different product is opened,
    // reset back to the first step
    return () => {
      dispatch({ type: "campaign creation reset" });
    };
  }, [productId]);

  const { title, content } = (() => {
    switch (step) {
      case "budget and duration": {
        return {
          title: "Promote a product",
          content: <BudgetAndDuration />,
        };
      }
      case "add payment": {
        return {
          title: "Add a new card",
          content: <PaymentForm />,
        };
      }
      case "confirm": {
        return {
          title: "Confirm details",
          content: <Confirm />,
        };
      }
      default: {
        assertNever(step, true);
      }
    }
  })();

  return (
    <CampaignCreationContext.Provider
      value={{
        state,
        dispatch,
      }}
    >
      <ModalHeading>{title}</ModalHeading>
      <ModalContent height={step === "add payment" ? "22rem" : undefined}>
        {content}
      </ModalContent>
    </CampaignCreationContext.Provider>
  );
};
