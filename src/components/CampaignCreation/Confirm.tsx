import { Button } from "@components/Button";
import { Icon } from "@components/Icon";
import { CampaignBudget, CampaignSummary } from "@components/common";
import { usePromotionContext } from "@context";
import { services } from "@services/central-services";
import { logger } from "@utils/logger";
import { FunctionalComponent } from "preact";
import { useState } from "preact/hooks";

export const Confirm: FunctionalComponent = () => {
  const { authToken, vendorId, currency, state, dispatch, centralServicesUrl } =
    usePromotionContext();
  const {
    productDataById,
    selectedProductId,
    campaignCreation: { dailyBudget, durationDays, type },
  } = state;

  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);

  // TODO(christopherbot) improve progress state: e.g. what if
  // a user closes the modal while waiting for the api to repsond
  // and then re-opens the modal?
  const launchCampaign = async () => {
    setIsLoading(true);
    setHasError(false);

    const productData = selectedProductId
      ? productDataById[selectedProductId]
      : null;

    const startDate = new Date();
    const endDate = new Date();
    endDate.setDate(startDate.getDate() + durationDays);

    const handleCreateProductCampaign = async (productId: string) => {
      const campaign = await services.createProductCampaign(
        centralServicesUrl,
        authToken,
        vendorId,
        {
          productId,
          name: `${productData?.name || selectedProductId} Campaign`,
          dailyBudget,
          startDate: startDate.toISOString(),
          endDate: endDate.toISOString(),
          currencyCode: currency.code,
        }
      );

      const report = await services.getCampaignReport(
        centralServicesUrl,
        authToken,
        campaign.campaignId
      );

      dispatch({
        type: "product campaign launched",
        payload: { campaign, report, productId },
      });
    };

    const handleCreateShopCampaign = async () => {
      await services.createShopCampaign(
        centralServicesUrl,
        authToken,
        vendorId,
        {
          dailyBudget,
          endDate: endDate.toISOString(),
        }
      );

      dispatch({
        type: "shop campaign launched",
      });
    };
    let createCampaign;
    if (type === "product") {
      if (!selectedProductId) {
        logger.error("Cannot create campaign without a product selected.");
        setIsLoading(false);
        setHasError(true);
        return;
      }
      createCampaign = async () => {
        await handleCreateProductCampaign(selectedProductId);
      };
    } else {
      createCampaign = handleCreateShopCampaign;
    }

    try {
      await createCampaign();
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
