import { PromoteButton } from "@components/Button";
import { Portal } from "@components/Portal";
import { usePromotionContext } from "@context";
import { services } from "@services/central-services";
import { RequestStatus } from "@types";
import { logger } from "@utils/logger";
import { Fragment, FunctionalComponent, h } from "preact";
import { useEffect, useState } from "preact/hooks";

export const PromoteShop: FunctionalComponent = () => {
  const {
    centralServicesUrl,
    authToken,
    vendorId,
    promoteShopClassName,
    dispatch,
    state: { shopCampaignLaunched },
  } = usePromotionContext();
  const [promoteButtonElement, setPromoteButtonElement] =
    useState<HTMLElement>();
  const [status, setStatus] = useState<RequestStatus>("pending");
  const [shopCampaignId, setShopCampaignId] = useState<string | null>(null);

  useEffect(() => {
    const promoteElements = [
      ...document.getElementsByClassName(promoteShopClassName),
    ] as HTMLElement[];

    if (promoteElements.length != 1) {
      return;
    }
    setPromoteButtonElement(promoteElements[0]);
    /*
      NOTE (samet)
      The reason for the following eslint-disable-next-line:
      We don't need to run this effect after selectedProductId changes.
      We are using it to check if the selected product is still
      in the view when this effect runs.
    */
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, promoteShopClassName]);

  useEffect(() => {
    const getShopCampaign = async () => {
      if (!promoteButtonElement) return;
      setStatus("pending");

      try {
        const res = await services.getShopCampaign(
          centralServicesUrl,
          authToken
        );
        const campaign = res?.exists ? res.campaign : null;
        setStatus("success");
        if (campaign) {
          dispatch({
            type: "campaign retrieved",
            payload: { campaign },
          });
          setShopCampaignId(campaign.campaignId);
        }
      } catch (error) {
        setStatus("error");
        logger.error("Failed to get shop campaign", error);
      }
    };

    getShopCampaign();
    /*
      NOTE (samet)
      The reason for the following eslint-disable-next-line:
      It is not necessary to run this effect when new products
      are added to campaignIdsByProductId.
      We are using it to determine which products are already fetched
      when this effect runs.
    */
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, authToken, vendorId, promoteButtonElement]);

  return (
    <Fragment>
      {promoteButtonElement && (
        <Portal target={promoteButtonElement}>
          <PromoteButton
            onClick={() => {
              dispatch({ type: "promote shop button clicked" });
              if (shopCampaignId) {
                dispatch({
                  type: "set campaign Id",
                  payload: { campaignId: shopCampaignId },
                });
              }
            }}
            status={status || "idle"}
            hasCampaign={!!shopCampaignId || shopCampaignLaunched}
          />
        </Portal>
      )}
    </Fragment>
  );
};
