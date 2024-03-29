import { Icon } from "@components/Icon";
import { ModalContent, ModalHeading } from "@components/Modal";
import { usePromotionContext } from "@context";
import { assertNever } from "@utils/assert-never";
import { FunctionalComponent, Fragment } from "preact";
import { useEffect } from "preact/hooks";

import { BudgetAndDuration } from "./BudgetAndDuration";
import { Confirm } from "./Confirm";
import { Launched } from "./Launched";
import "./style.css";

export const CampaignCreation: FunctionalComponent = () => {
  const { state, dispatch } = usePromotionContext();
  const {
    productDataById,
    selectedProductId,
    campaignCreation: { step },
  } = state;

  useEffect(() => {
    // If the modal for a different product is opened,
    // reset back to the first step
    return () => {
      dispatch({ type: "campaign creation reset" });
    };
  }, [dispatch, selectedProductId]);

  const {
    title,
    content,
    subtitle = undefined,
  } = (() => {
    switch (step) {
      case "budget and duration": {
        return {
          title: selectedProductId ? "Promote a product" : "Promote My Shop",
          subtitle: selectedProductId
            ? productDataById[selectedProductId].name
            : "Get more orders from promoting your listings in search, category, and check out pages!",
          content: <BudgetAndDuration />,
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
      case "launched":
        return "13rem";
      default:
        return undefined;
    }
  })();

  return (
    <Fragment>
      <ModalHeading title={title} subtitle={subtitle} />
      <ModalContent height={contentHeight}>{content}</ModalContent>
    </Fragment>
  );
};
