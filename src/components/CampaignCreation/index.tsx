import { Icon } from "@components/Icon";
import { ModalContent, ModalHeading } from "@components/Modal";
import { useProductPromotion } from "@context";
import { useAsync } from "@hooks/use-async";
import * as services from "@services/central-services";
import { recommendedBudgetUSD, initialDurationDays } from "@state";
import { assertNever } from "@utils/assert-never";
import { getStripe } from "@utils/payment";
import { h, FunctionalComponent, Fragment } from "preact";
import { useCallback, useEffect } from "preact/hooks";

import { BudgetAndDuration } from "./BudgetAndDuration";
import { Confirm } from "./Confirm";
import { Launched } from "./Launched";
import { PaymentForm } from "./PaymentForm";
import "./style.css";

export const CampaignCreation: FunctionalComponent<{
  productId: string | null;
}> = ({ productId }) => {
  const { authToken, state, dispatch } = useProductPromotion();
  const { step } = state.campaignCreation;

  useEffect(() => {
    dispatch({
      type: "campaign creation daily budget updated",
      payload: { amount: recommendedBudgetUSD },
    });
  }, [dispatch]);

  useEffect(() => {
    dispatch({
      type: "campaign creation duration updated",
      payload: { days: initialDurationDays },
    });
  }, [dispatch]);

  const getPaymentMethods = useAsync(
    useCallback(() => services.getPaymentMethods(authToken), [authToken])
  );

  useEffect(() => {
    const paymentMethods = getPaymentMethods.value;
    if (!paymentMethods) return;

    if (paymentMethods.length === 0) {
      // To reduce load time later, load Stripe early if we know
      // the user will need to add a card
      getStripe();
    }

    dispatch({
      type: "payment methods received",
      payload: { paymentMethods },
    });
  }, [dispatch, getPaymentMethods.value]);

  useEffect(() => {
    // If the modal for a different product is opened,
    // reset back to the first step
    return () => {
      dispatch({ type: "campaign creation reset" });
    };
  }, [dispatch, productId]);

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
    <Fragment>
      <ModalHeading>{title}</ModalHeading>
      <ModalContent height={contentHeight}>{content}</ModalContent>
    </Fragment>
  );
};
