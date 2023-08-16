import { MarketplaceDetails } from "@api/types";
import { TopsortPromotionsWithContext } from "@components/Promotions";
import {
  defaultPromoteShopClassName,
  defaultPromoteTargetClassName,
  largeNumberWithDecimals,
} from "@constants";
import { services } from "@services/central-services";
import { validationService } from "@services/validation-service";
import { Currency, initialParamsSchema, InitParams } from "@types";
import { logger } from "@utils/logger";
import { render } from "preact";

import "./app.css";
import "./utils.css";

export default class TopsortBlocks {
  private centralServicesUrl?: string;
  private authToken?: string;
  private vendorId?: string;
  private marketplaceDetails?: MarketplaceDetails;
  private promoteTargetClassName: InitParams["promoteTargetClassName"];
  private promoteShopClassName: InitParams["promoteShopClassName"];
  private style: InitParams["style"];
  private text: InitParams["text"];
  private formatNumber?: Intl.NumberFormat["format"];
  private formatMoney?: (
    number: number
  ) => ReturnType<Intl.NumberFormat["format"]>;
  private currency?: Currency;
  private isUsingProductPromotion = false;
  private isUsingShopPromotion = false;
  /*
    NOTE (samet)
    We are increasing the counter variable when the library consumer
    calls "useProductPromotion".
    The purpose is to run some of the effects in the "App" component.
  */
  private counter = 0;

  static promoteTargetClassName = defaultPromoteTargetClassName;
  static promoteShopClassName = defaultPromoteShopClassName;

  async init(params: InitParams) {
    try {
      const {
        extraAuthHeaders,
        externalVendorId,
        promoteTargetClassName,
        promoteShopClassName,
        style,
        text,
        centralServicesUrl,
        authUrl,
      } = initialParamsSchema.parse(params);
      const { authToken, authorized } =
        await validationService.getValidationToken(
          authUrl,
          externalVendorId,
          extraAuthHeaders
        );

      if (!authorized) {
        throw new Error("Api Key not valid");
      }

      this.vendorId = externalVendorId;
      this.authToken = authToken;
      this.centralServicesUrl = centralServicesUrl;
      const marketplaceDetails = await services.getMarketplaceDetails(
        this.centralServicesUrl,
        this.authToken
      );
      this.marketplaceDetails = marketplaceDetails;
      const { currencyCode, currencyExponent, languagePreference } =
        this.marketplaceDetails;

      const moneyFormat = new Intl.NumberFormat(languagePreference, {
        style: "currency",
        currency: currencyCode,
      });
      const moneyParts = moneyFormat.formatToParts(largeNumberWithDecimals);
      const currencyDivisor = Math.pow(10, currencyExponent);

      this.formatNumber = new Intl.NumberFormat(languagePreference).format;
      this.formatMoney = (number: number) =>
        moneyFormat.format(number / currencyDivisor);
      this.currency = {
        code: currencyCode,
        divisor: currencyDivisor,
        exponent: currencyExponent,
        decimalSeparator: moneyParts.find((part) => part.type === "decimal")
          ?.value,
        groupSeparator: moneyParts.find((part) => part.type === "group")?.value,
        symbol:
          moneyParts.find((part) => part.type === "currency")?.value || "$",
        isSymbolAtStart:
          moneyParts.findIndex((part) => part.type === "currency") <
          moneyParts.findIndex((part) => part.type === "integer"),
      };
      this.promoteTargetClassName = promoteTargetClassName;
      this.promoteShopClassName = promoteShopClassName;
      this.style = style;
      this.text = text;
    } catch (error) {
      logger.error("Failed to get marketplace details.", error);
    }
  }

  private renderPromotions() {
    if (
      !this.centralServicesUrl ||
      !this.authToken ||
      !this.vendorId ||
      !this.marketplaceDetails ||
      !this.currency ||
      !this.formatNumber ||
      !this.formatMoney
    ) {
      if (!this.centralServicesUrl) {
        logger.warn(
          'Cannot call "useProductPromotion" without centralServicesUrl set'
        );
      }
      if (!this.authToken) {
        logger.warn(
          'Cannot call "useProductPromotion" without an authToken set.'
        );
      }

      if (!this.vendorId) {
        logger.warn(
          'Cannot call "useProductPromotion" without a vendorId set.'
        );
      }

      if (!this.marketplaceDetails) {
        logger.warn(
          'Cannot call "useProductPromotion" without marketplace details.'
        );
      }

      return;
    }

    this.counter++;

    render(
      <TopsortPromotionsWithContext
        centralServicesUrl={this.centralServicesUrl}
        authToken={this.authToken}
        vendorId={this.vendorId}
        language={this.marketplaceDetails.languagePreference}
        currency={this.currency}
        formatNumber={this.formatNumber}
        formatMoney={this.formatMoney}
        promoteTargetClassName={
          this.promoteTargetClassName || defaultPromoteTargetClassName
        }
        promoteShopClassName={
          this.promoteShopClassName || defaultPromoteShopClassName
        }
        style={this.style || {}}
        text={this.text || {}}
        counter={this.counter}
        isUsingProductPromotion={this.isUsingProductPromotion}
        isUsingShopPromotion={this.isUsingShopPromotion}
      />,
      document.body
    );
  }

  useProductPromotion() {
    this.isUsingProductPromotion = true;
    this.renderPromotions();
  }

  useShopPromotion() {
    this.isUsingShopPromotion = true;
    this.renderPromotions();
  }
}

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
window.TopsortBlocks = TopsortBlocks;
