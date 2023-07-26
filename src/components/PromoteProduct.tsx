import { PromoteButton } from "@components/Button";
import { Portal } from "@components/Portal";
import { usePromotionContext } from "@context";
import { services } from "@services/central-services";
import { State } from "@state";
import { RequestStatus } from "@types";
import { logger } from "@utils/logger";
import { Fragment, FunctionalComponent, h } from "preact";
import { useEffect, useMemo, useRef, useState } from "preact/hooks";

export const PromoteProduct: FunctionalComponent = () => {
  const {
    centralServicesUrl,
    authToken,
    vendorId,
    promoteTargetClassName = "",
    counter,
    dispatch,
    state: { campaignIdsByProductId, selectedProductId },
  } = usePromotionContext();
  const [promoteTargets, setPromoteTargets] = useState<HTMLElement[]>([]);
  const [statusesByProductId, setStatusesByProductId] = useState<
    Record<string, RequestStatus>
  >({});
  const currentCounter = useRef(counter);

  const promoteTargetIds = useMemo(() => {
    return promoteTargets
      .map((promoteTarget) => promoteTarget.dataset.tsProductId ?? "")
      .sort()
      .join("-");
  }, [promoteTargets]);

  useEffect(() => {
    const promoteTargets = [
      ...document.getElementsByClassName(promoteTargetClassName),
    ] as HTMLElement[];

    if (promoteTargets.length === 0) {
      if (selectedProductId) {
        dispatch({ type: "modal close button clicked" });
      }
      setPromoteTargets([]);
      return;
    }

    const productDataById = promoteTargets.reduce((dataById, promoteTarget) => {
      const productId = promoteTarget.dataset.tsProductId;
      const productName = promoteTarget.dataset.tsProductName;
      const productImgUrl = promoteTarget.dataset.tsProductImgUrl;

      if (productId && productName && productImgUrl) {
        dataById[productId] = {
          id: productId,
          name: productName,
          imgUrl: productImgUrl,
        };
      } else {
        logger.warn("Missing data attributes on promote target:", {
          "ts-product-id": productId || "(missing)",
          "ts-product-name": productName || "(missing)",
          "ts-product-img-url": productImgUrl || "(missing)",
        });
      }

      return dataById;
    }, {} as State["productDataById"]);

    if (selectedProductId && !(selectedProductId in productDataById)) {
      dispatch({ type: "modal close button clicked" });
    }

    dispatch({
      type: "promote targets retrieved",
      payload: {
        productDataById,
      },
    });

    setPromoteTargets(promoteTargets);
    /*
      NOTE (samet)
      The reason for the following eslint-disable-next-line:
      We don't need to run this effect after selectedProductId changes.
      We are using it to check if the selected product is still
      in the view when this effect runs.
    */
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, promoteTargetClassName, counter]);

  const updateStatuses = (productIds: string[], status: RequestStatus) => {
    setStatusesByProductId((prev) => ({
      ...prev,
      ...productIds.reduce(
        (statuses, productId) =>
          Object.assign(statuses, { [productId]: status }),
        {} as Record<string, RequestStatus>
      ),
    }));
  };

  useEffect(() => {
    const getCampaignIdsByProductId = async () => {
      if (promoteTargets.length === 0) return;

      currentCounter.current = counter;

      const newProductIds = promoteTargets
        .map((promoteTarget) => promoteTarget.dataset.tsProductId)
        .filter(
          (productId): productId is string =>
            !!productId && !(productId in campaignIdsByProductId)
        );

      if (newProductIds.length === 0) return;

      updateStatuses(newProductIds, "pending");

      try {
        const campaignIdsByProductId = await services.getCampaignIdsByProductId(
          centralServicesUrl,
          authToken,
          vendorId,
          newProductIds
        );

        updateStatuses(newProductIds, "success");
        dispatch({
          type: "campaign ids by product id retrieved",
          payload: { campaignIdsByProductId },
        });
      } catch (error) {
        if (counter < currentCounter.current) {
          return;
        }

        updateStatuses(newProductIds, "error");
        logger.error("Failed to get campaign ids by product id.", error);
      }
    };

    getCampaignIdsByProductId();
    /*
      NOTE (samet)
      The reason for the following eslint-disable-next-line:
      It is not necessary to run this effect when new products
      are added to campaignIdsByProductId.
      We are using it to determine which products are already fetched
      when this effect runs.
    */
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, authToken, vendorId, promoteTargetIds]);

  return (
    <Fragment>
      {promoteTargets.map((promoteTarget, index) => {
        const productId = promoteTarget.dataset.tsProductId;

        if (!productId) {
          return null;
        }

        return (
          <Portal key={index} target={promoteTarget}>
            <PromoteButton
              key={index}
              onClick={() => {
                dispatch({ type: "product selected", payload: { productId } });
                dispatch({
                  type: "set campaign Id",
                  payload: { campaignId: campaignIdsByProductId[productId] },
                });
              }}
              status={statusesByProductId[productId] || "idle"}
              hasCampaign={!!campaignIdsByProductId[productId]}
            />
          </Portal>
        );
      })}
    </Fragment>
  );
};
