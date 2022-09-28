import { Icon } from "@components/Icon";
import { ModalContent, ModalHeading } from "@components/Modal";
import { assertNever } from "@utils/assert-never";
import { getStripe } from "@utils/stripe";
import { h, FunctionalComponent, Fragment } from "preact";
import { useEffect, useReducer } from "preact/hooks";

import { BudgetAndDuration } from "./BudgetAndDuration";
import { Confirm } from "./Confirm";
import { Launched } from "./Launched";
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
  const { step } = state;

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

    if (fetchedPaymentMethods.length === 0) {
      // To reduce load time later, load Stripe early if we know
      // the user will need to add a card
      getStripe();
    }

    dispatch({
      type: "payment methods received",
      payload: { paymentMethods: fetchedPaymentMethods },
    });
  }, [dispatch]);

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
      case "launched": {
        return {
          title: (
            <Fragment>
              <Icon size={32} name="tick-circle" />
              <span>Your campaign was launched!</span>
            </Fragment>
          ),
          content: <Launched />,
        };
      }
      default: {
        assertNever(step, true);
      }
    }
  })();
  const contentHeight = (() => {
    switch (step) {
      case "add payment":
        return "27rem";
      case "launched":
        return "13rem";
      default:
        return undefined;
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
      <ModalContent height={contentHeight}>{content}</ModalContent>
    </CampaignCreationContext.Provider>
  );
};
