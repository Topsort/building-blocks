import { MS_PER_DAY, MS_PER_HOUR, MS_PER_MIN, MS_PER_SEC } from "@constants";
import { usePromotionContext } from "@context";
import cx from "classnames";
import { h, FunctionalComponent, Fragment } from "preact";
import { useMemo } from "preact/hooks";

const padTime = (num: number) => `0${num}`.slice(-2);

export const CampaignSummary: FunctionalComponent<{
  startDate?: string;
}> = ({ startDate }) => {
  const { state, isUsingShopPromotion } = usePromotionContext();
  const { productDataById, selectedProductId } = state;
  const productData = selectedProductId
    ? productDataById[selectedProductId]
    : null;
  const isShopPromotion = !productData && isUsingShopPromotion;

  // FIXME(christopherbot) UI is showing the wrong hours, likely
  // due to timezones not being taken into account somewhere
  // (creation flow? here? CS?)
  const remaining = useMemo(() => {
    if (!startDate) return null;

    const start = new Date(startDate);
    const timeDiff = Date.now() - start.getTime();
    const days = Math.floor(timeDiff / MS_PER_DAY);
    const timeDiff2 = timeDiff % MS_PER_DAY;
    const hours = Math.floor(timeDiff2 / MS_PER_HOUR);
    const timeDiff3 = timeDiff2 % MS_PER_HOUR;
    const minutes = Math.floor(timeDiff3 / MS_PER_MIN);
    const timeDiff4 = timeDiff3 % MS_PER_MIN;
    const seconds = Math.floor(timeDiff4 / MS_PER_SEC);
    return {
      days,
      hours,
      minutes: padTime(minutes),
      seconds: padTime(seconds),
    };
  }, [startDate]);

  return (
    <div className="ts-campaign-summary ts-space-x-4">
      {isShopPromotion ? (
        <div
          className={cx("ts-campaign-box", {
            "ts-product-image--md": remaining,
          })}
          //todo(sofia): vendor name
        >
          Vendor Name
        </div>
      ) : (
        <img
          className={cx("ts-product-image", {
            "ts-product-image--md": remaining,
          })}
          // TODO(christopherbot) handle missing imgUrl
          src={productData?.imgUrl}
        />
      )}
      <div className="ts-campaign-summary-name">
        {/* TODO(christopherbot) handle missing name */}
        <span>
          {isShopPromotion ? (
            <Fragment>Ongoing promotion of my current listings</Fragment>
          ) : (
            productData?.name
          )}
        </span>
        {remaining && (
          <span className="ts-campaign-summary-time">
            {remaining.days} {remaining.days === 1 ? "day" : "days"}{" "}
            {remaining.hours}:{remaining.minutes}:{remaining.seconds} since
            running.
          </span>
        )}
      </div>
    </div>
  );
};
