import { ExistingCampaignResponse } from "@api/schemas";
import { CampaignCreation } from "@components/CampaignCreation";
import { CampaignDetails } from "@components/CampaignDetails";
import { Modal } from "@components/Modal";
import Portal from "@components/Portal";
import { ProductActive } from "@components/ProductActive";
import { PromoteButton } from "@components/PromoteButton";
import { defaultPromoteTargetClassName, portalRootId } from "@constants";
import { ProductPromotionContext, useProductPromotion } from "@context";
import * as hooks from "@hooks/index";
import * as services from "@services/central-services";
import { Campaign, CustomText, Style } from "@types";
import { logger } from "@utils/logger";
import { Fragment, FunctionalComponent, h, render } from "preact";
import { useCallback, useEffect, useState } from "preact/hooks";

import "./app.css";
import "./utils.css";

const App: FunctionalComponent = () => {
  const { authToken, promoteTargetClassName } = useProductPromotion();
  const [productId, setProductId] = useState<string | null>(null);
  const [promoteTargets, setPromoteTargets] = useState<HTMLElement[]>([]);
  const [productCampaigns, setProductCampaigns] = useState<
    Record<string, Campaign>
  >({});
  const campaignDetails = productId ? productCampaigns[productId] : null;

  useEffect(() => {
    const promoteTargets = [
      ...document.getElementsByClassName(promoteTargetClassName),
    ];

    if (promoteTargets.length === 0) {
      logger.warn(
        "No promote targets found. Did you add the right className to the promote targets?\n\n" +
          "If you are using a custom className, make sure to pass it in the `initProductPromotion` options."
      );
    }
    setPromoteTargets(promoteTargets as HTMLElement[]);

    const testPromoteTarget = promoteTargets[0];

    if (!(testPromoteTarget instanceof HTMLElement)) return;
    const productId = testPromoteTarget.dataset.tsProductId;
    if (!productId) {
      logger.warn("Skipping button on element with no data-ts-product-id.");
      return;
    }

    const productCampaign = {
      budget: 200,
      name: `Too FacedHangover ${productId}`,
      productImageUrl: "//www.html.am/images/image-codes/milford_sound_t.jpg",
      totalSpend: "$99,698",
      totalSales: "$123,99",
      roas: "24%",
      days: 4,
      minRoas: "4x",
      impressions: 1341,
      clicks: 24,
      purchases: 19,
      status: true,
    }; //TODO (sofia): getProductCampaign(productId);
    const hasCampaign = !!productCampaign;
    if (hasCampaign) {
      setProductCampaigns((prev) => {
        return {
          ...prev,
          [productId]: productCampaign,
        };
      });
    }
  }, [promoteTargetClassName]);

  const fetchExistingProductInCampaign: () => Promise<ExistingCampaignResponse> =
    useCallback(() => {
      if (!productId) {
        return Promise.resolve({ campaignId: null, activeBids: 0 });
      }
      return services.getExistingCampaignByProductId(authToken, productId);
    }, [authToken, productId]);

  const { execute, status, value, error } = hooks.useAsync(
    fetchExistingProductInCampaign,
    false
  );

  useEffect(() => {
    if (productId) {
      execute();
    }
  }, [execute, productId]);

  useEffect(() => {
    if (status === "error") {
      logger.error("[getExistingCampaignByProductId]", error);
    }
  }, [status, error]);

  return (
    <Fragment>
      {promoteTargets.map((promoteTarget, index) => {
        const productId = promoteTarget.dataset.tsProductId;

        if (!productId) {
          logger.warn("Skipping button on element with no data-ts-product-id.");
          return null;
        }

        return (
          <Portal key={index} target={promoteTarget}>
            <PromoteButton
              key={index}
              onClick={() => {
                setProductId(productId);
              }}
              hasCampaign={!!productCampaigns[productId]}
            />
          </Portal>
        );
      })}
      <Portal target={`#${portalRootId}`}>
        <Modal
          onClose={() => {
            setProductId(null);
          }}
          isOpen={!!productId}
        >
          {campaignDetails ? (
            <CampaignDetails campaignDetails={campaignDetails} />
          ) : (
            <Fragment>
              {status === "error" && <div>Error fetching data</div>}
              {status === "pending" && <div>Loading...</div>}
              {status === "success" && (
                <Fragment>
                  {value?.campaignId ? (
                    <ProductActive
                      campaignId={value.campaignId}
                      activeBids={value.activeBids}
                    />
                  ) : (
                    <CampaignCreation productId={productId} />
                  )}
                </Fragment>
              )}
            </Fragment>
          )}
        </Modal>
      </Portal>
    </Fragment>
  );
};

type InitParams = {
  apiKey: string;
  externalVendorId: string;
};

type InitProductPromotion = {
  promoteTargetClassName?: string;
  style?: Style;
  text?: CustomText;
};

export default class TopsortElements {
  private authToken?: string;

  static promoteTargetClassName = defaultPromoteTargetClassName;

  async init(params: InitParams) {
    if (typeof params !== "object") {
      logger.error('Method "init" is missing the required params object.');
      return;
    }

    if (!params.apiKey) {
      logger.error(
        'Method "init" is missing the required apiKey in the params object.'
      );
      return;
    }

    try {
      const authToken = await services.validateVendor(
        params.apiKey,
        params.externalVendorId
      );
      this.authToken = authToken;
    } catch (error) {
      logger.error("[validateVendor]", error);
    }
  }

  initProductPromotion({
    promoteTargetClassName,
    style,
    text,
  }: InitProductPromotion = {}) {
    if (!this.authToken) {
      logger.warn('Cannot call "initProductPromotion" without an authToken.');
      return;
    }

    const portalRoot = document.createElement("div");
    portalRoot.setAttribute("id", portalRootId);
    document.body.appendChild(portalRoot);

    render(
      <ProductPromotionContext.Provider
        value={{
          authToken: this.authToken,
          promoteTargetClassName:
            promoteTargetClassName || defaultPromoteTargetClassName,
          style: style || {},
          text: text || {},
        }}
      >
        <App />
      </ProductPromotionContext.Provider>,
      document.body
    );
  }
}
