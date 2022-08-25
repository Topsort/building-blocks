import { CampaignCreation } from "@components/CampaignCreation";
import { CampaignDetails } from "@components/CampaignDetails";
import { Modal } from "@components/Modal";
import Portal from "@components/Portal";
import { PromoteButton } from "@components/PromoteButton";
import { defaultPromoteTargetClassName, portalRootId } from "@constants";
import { CustomText, Style } from "@types";
import { FunctionalComponent, h, render } from "preact";
import { useEffect, useState } from "preact/hooks";

import "./app.css";

const logPrefix = "[Topsort Elements]";
const logger = {
  info: (...msg: any[]) => console.log(logPrefix, ...msg),
  warn: (...msg: any[]) => console.warn(logPrefix, ...msg),
  error: (...msg: any[]) => console.error(logPrefix, ...msg),
};
export type Campaign = {
  budget: number;
  name: string;
  productImageUrl: string;
  totalSpend: string;
  totalSales: string;
  roas: string;
  days: number;
  minRoas: string;
  impressions: number;
  clicks: number;
  purchases: number;
  status: boolean;
};
const App: FunctionalComponent<InitProductPromotion> = ({
  promoteTargetClassName,
  style,
  text,
}) => {
  const [productId, setProductId] = useState<string | null>(null);
  const [productCampaigns, setProductCampaigns] = useState<{
    [productId: string]: Campaign;
  }>({});
  const campaignDetails = productId ? productCampaigns[productId] : null;

  useEffect(() => {
    const promoteTargets = [
      ...document.getElementsByClassName(
        promoteTargetClassName || defaultPromoteTargetClassName
      ),
    ];

    if (promoteTargets.length === 0) {
      logger.warn(
        "No promote targets found. Did you add the right className to the promote targets?\n\n" +
          "If you are using a custom className, make sure to pass it in the `initProductPromotion` options."
      );
    }

    promoteTargets.forEach((target, index) => {
      if (!(target instanceof HTMLElement)) return;

      const productId = target.dataset.tsProductId;

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

      render(
        <PromoteButton
          key={index}
          style={style}
          text={text}
          hasCampaign={hasCampaign}
          onClick={() => {
            setProductId(productId);
          }}
        />,
        target
      );
    });
  }, [promoteTargetClassName, style, text]);

  return (
    <Portal>
      <Modal
        text={text}
        onClose={() => {
          setProductId(null);
        }}
        isOpen={!!productId}
      >
        {campaignDetails ? (
          <CampaignDetails
            productId={productId}
            campaignDetails={campaignDetails}
          />
        ) : (
          <CampaignCreation text={text} productId={productId} style={style} />
        )}
      </Modal>
    </Portal>
  );
};

type InitParams = {
  apiKey: string;
};

type InitProductPromotion = {
  promoteTargetClassName?: string;
  style?: Style;
  text?: CustomText;
};

export default class TopsortElements {
  private apiToken?: string;

  static promoteTargetClassName = defaultPromoteTargetClassName;

  constructor(params: InitParams) {
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

    // TODO(christopherbot) server-side validation
    // Call an endpoint in CC with apiKey and vendorId, which would auth them and return an apiToken.
    // This code will have to be moved out of the ctor and into an async init method.
    const validate = (a: any) => a;
    const apiToken = validate(params.apiKey);

    this.apiToken = apiToken;
  }

  initProductPromotion({
    promoteTargetClassName,
    style,
    text,
  }: InitProductPromotion = {}) {
    if (!this.apiToken) {
      logger.warn('Cannot call "initProductPromotion" without an apiToken.');
      return;
    }

    const portalRoot = document.createElement("div");
    portalRoot.setAttribute("id", portalRootId);
    document.body.appendChild(portalRoot);

    render(
      <App
        promoteTargetClassName={promoteTargetClassName}
        style={style}
        text={text}
      />,
      document.body
    );
  }
}
