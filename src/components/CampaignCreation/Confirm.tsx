import { Button } from "@components/Button";
import { Icon } from "@components/Icon";
import { CampaignBudget, CampaignSummary } from "@components/common";
import { useProductPromotion } from "@context";
import { services } from "@services/central-services";
import { logger } from "@utils/logger";
import { h, FunctionalComponent } from "preact";
import { useState } from "preact/hooks";

export const Confirm: FunctionalComponent = () => {
  const { authToken, vendorId, currency, state, dispatch } =
    useProductPromotion();
  const {
    productDataById,
    selectedProductId,
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

    if (!selectedProductId) {
      logger.error("Cannot create campaign without a product selected.");
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
        currencyCode: currency.code,
      });

      dispatch({
        type: "campaign launched",
        payload: { campaign, productId: selectedProductId },
      });
    } catch (error) {
      logger.error("Failed to create campaign.", error);
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
