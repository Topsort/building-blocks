import { Campaign } from "@api/types";
import { Icon, IconName } from "@components/Icon";
import { h, FunctionalComponent } from "preact";

// TODO(christopherbot) get language from marketplace (or just from the browser)?
const language = "en";
const currency = "USD";

export const Metrics: FunctionalComponent<{
  campaign: Campaign;
  title: string;
}> = ({ campaign, title }) => {
  const { impressions, clicks, purchases } = campaign.campaignBehaviorData;
  const money = new Intl.NumberFormat(language, {
    style: "currency",
    currency,
  });
  return (
    <div className="ts-metrics">
      <span className="ts-metrics__title">{title}</span>
      <div class="ts-metrics__grid">
        <Metric
          title="Impressions"
          value={impressions.total.toLocaleString(language)}
          iconName="eye"
        />
        <Metric
          title="Clicks"
          value={clicks.total.toLocaleString(language)}
          iconName="mouse-square"
        />
        <Metric
          title="Purchases"
          // TODO(christophber) should this be `purchases.quantity` or `purchases.count`?
          // e.g. 6 coca colas being 6 or 1. This is a product decision.
          value={purchases.quantity.toLocaleString(language)}
          iconName="bag"
        />
        <Metric
          title="Total spend"
          // TODO(christopherbot) is this right? Tomi says: "we're not charging by impressions AFAIK"
          value={money.format(clicks.adSpent + impressions.adSpent)}
          iconName="money"
        />
        <Metric
          title="Total sales"
          value={money.format(purchases.amount)}
          iconName="message-add"
        />
        <Metric
          title="ROAS"
          // TODO(christopherbot) is this right? Tomi says: "there's no impressions at purchases attribution"
          value={`${(clicks.adSpent > 0
            ? purchases.amount / clicks.adSpent
            : 0
          ).toLocaleString(language)}x`}
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
