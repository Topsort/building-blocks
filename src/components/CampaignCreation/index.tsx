import { Icon } from "@components/Icon";
import { ModalContent, ModalHeading } from "@components/Modal";
import { useProductPromotion } from "@context";
import { services } from "@services/central-services";
import { assertNever } from "@utils/assert-never";
import { logger } from "@utils/logger";
import { getStripe } from "@utils/payment";
import { h, FunctionalComponent, Fragment } from "preact";
import { useEffect } from "preact/hooks";

import { BudgetAndDuration } from "./BudgetAndDuration";
import { Confirm } from "./Confirm";
import { Launched } from "./Launched";
import { PaymentForm } from "./PaymentForm";
import "./style.css";

export const CampaignCreation: FunctionalComponent = () => {
  const { authToken, state, dispatch } = useProductPromotion();
  const {
    selectedProductId,
    paymentMethods,
    campaignCreation: { step },
  } = state;

  useEffect(() => {
    const getPaymentMethods = async () => {
      try {
        if (paymentMethods.length > 0) return;

        const fetchedPaymentMethods = await services.getPaymentMethods(
          authToken
        );

        dispatch({
          type: "payment methods received",
          payload: { paymentMethods: fetchedPaymentMethods },
        });

        if (fetchedPaymentMethods.length === 0) {
          // To reduce load time later, load Stripe early if we know
          // the user will need to add a card
          getStripe();
        }
      } catch (error) {
        // TODO(christopherbot) display an error
        logger.error("Failed to fetch payment methods.", error);
      }
    };

    getPaymentMethods();
  }, [dispatch, authToken, paymentMethods.length]);

  useEffect(() => {
    // If the modal for a different product is opened,
    // reset back to the first step
    return () => {
      dispatch({ type: "campaign creation reset" });
    };
  }, [dispatch, selectedProductId]);

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
              <Icon size={32} name="tick-circle" className="ts-text-success" />
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
