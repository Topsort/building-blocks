import { Campaign } from "@api/types";
import { Icon, IconName } from "@components/Icon";
import { useProductPromotion } from "@context";
import { h, FunctionalComponent } from "preact";

export const Metrics: FunctionalComponent<{
  campaign: Campaign;
  title: string;
}> = ({ campaign, title }) => {
  const { numberFormater, moneyFormater } = useProductPromotion();
  const { impressions, clicks, purchases } = campaign.campaignBehaviorData;
  return (
    <div className="ts-metrics">
      <span className="ts-metrics__title">{title}</span>
      <div class="ts-metrics__grid">
        <Metric
          title="Impressions"
          value={numberFormater.format(impressions.total)}
          iconName="eye"
        />
        <Metric
          title="Clicks"
          value={numberFormater.format(clicks.total)}
          iconName="mouse-square"
        />
        <Metric
          title="Purchases"
          // TODO(christophber) should this be `purchases.quantity` or `purchases.count`?
          // e.g. 6 coca colas being 6 or 1. This is a product decision.
          value={numberFormater.format(purchases.quantity)}
          iconName="bag"
        />
        <Metric
          title="Total spend"
          // TODO(christopherbot) is this right? Tomi says: "we're not charging by impressions AFAIK"
          value={moneyFormater.format(clicks.adSpent + impressions.adSpent)}
          iconName="money"
        />
        <Metric
          title="Total sales"
          value={moneyFormater.format(purchases.amount)}
          iconName="message-add"
        />
        <Metric
          title="ROAS"
          // TODO(christopherbot) is this right? Tomi says: "there's no impressions at purchases attribution"
          value={`${numberFormater.format(
            clicks.adSpent > 0 ? purchases.amount / clicks.adSpent : 0
          )}x`}
          iconName="back-square"
        />
      </div>
    </div>
  );
};

const Metric: FunctionalComponent<{
  title: string;
  value: number | string;
  iconName: IconName;
}> = ({ title, value, iconName }) => {
  return (
    <div className="ts-metric">
      <Icon name={iconName} title={title} />
      <div className="ts-metric__content">
        <span className="ts-metric__title">{title}</span>
        <span className="ts-metric__value">{value}</span>
      </div>
    </div>
  );
};
