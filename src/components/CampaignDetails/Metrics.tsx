import { ReportDataWithAuctions } from "@api/types";
import { Icon, IconName } from "@components/Icon";
import { usePromotionContext } from "@context";
import { FunctionalComponent } from "preact";

export const Metrics: FunctionalComponent<{
  campaignReport: ReportDataWithAuctions;
  title: string;
}> = ({ campaignReport, title }) => {
  const { formatMoney, formatNumber } = usePromotionContext();
  const { impressions, clicks, purchases } = campaignReport;
  return (
    <div className="ts-metrics">
      <span className="ts-metrics__title">{title}</span>
      <div class="ts-metrics__grid">
        <Metric
          title="Impressions"
          value={formatNumber(impressions.total)}
          iconName="eye"
        />
        <Metric
          title="Clicks"
          value={formatNumber(clicks.total)}
          iconName="mouse-square"
        />
        <Metric
          title="Purchases"
          // TODO(christophber) should this be `purchases.quantity` or `purchases.count`?
          // e.g. 6 coca colas being 6 or 1. This is a product decision.
          value={formatNumber(purchases.quantity)}
          iconName="bag"
        />
        <Metric
          title="Total spend"
          // TODO(christopherbot) is this right? Tomi says: "we're not charging by impressions AFAIK"
          value={formatMoney(Number(clicks.adSpent + impressions.adSpent))}
          iconName="money"
        />
        <Metric
          title="Total sales"
          value={formatMoney(Number(purchases.amount))}
          iconName="message-add"
        />
        <Metric
          title="ROAS"
          // TODO(christopherbot) is this right? Tomi says: "there's no impressions at purchases attribution"
          value={`${formatNumber(
            clicks.adSpent > 0 ? purchases.amount / clicks.adSpent : 0
          )}x`}
          iconName="back-square"
        />
      </div>
    </div>
  );
};

export const ShopMetrics: FunctionalComponent<{
  campaignReport: ReportDataWithAuctions;
}> = ({ campaignReport }) => {
  const { formatMoney, formatNumber } = usePromotionContext();
  const { impressions, clicks, purchases } = campaignReport;
  return (
    <div className="ts-metrics ts-shop-metrics">
      <div class="ts-metrics__grid ts-shop-metrics__grid">
        <Metric
          title="Total sales"
          value={formatMoney(Number(purchases.amount))}
          iconName="message-add"
          iconSize={18}
        />
        <Metric
          title="Impressions"
          value={formatNumber(impressions.total)}
          iconName="eye"
          iconSize={18}
        />
        <Metric
          title="Clicks"
          value={formatNumber(clicks.total)}
          iconName="mouse-square"
          iconSize={18}
        />
        <Metric
          title="Purchases"
          // TODO(christophber) should this be `purchases.quantity` or `purchases.count`?
          // e.g. 6 coca colas being 6 or 1. This is a product decision.
          value={formatNumber(purchases.quantity)}
          iconName="bag"
          iconSize={18}
        />
      </div>
    </div>
  );
};

const Metric: FunctionalComponent<{
  title: string;
  value: number | string;
  iconName: IconName;
  iconSize?: number;
}> = ({ title, value, iconName, iconSize }) => {
  return (
    <div className="ts-metric">
      <Icon name={iconName} title={title} size={iconSize} />
      <div className="ts-metric__content">
        <span className="ts-metric__title">{title}</span>
        <span className="ts-metric__value">{value}</span>
      </div>
    </div>
  );
};
