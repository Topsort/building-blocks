import { Campaign } from "@api/types";
import { Icon, IconName } from "@components/Icon";
import { h, FunctionalComponent } from "preact";

export const Metrics: FunctionalComponent<{
  campaign: Campaign;
  title: string;
}> = ({ campaign, title }) => {
  return (
    <div className="ts-metrics">
      <span className="ts-metrics__title">{title}</span>
      <div class="ts-metrics__grid">
        <Metric
          title="Impressions"
          value={campaign.campaignBehaviorData.impressions.total}
          iconName="eye"
        />
        <Metric
          title="Clicks"
          value={campaign.campaignBehaviorData.clicks.total}
          iconName="mouse-square"
        />
        <Metric
          title="Purchases"
          value={campaign.campaignBehaviorData.purchases.amount}
          iconName="bag"
        />
        <Metric
          title="Total spend"
          // value={campaign.totalSpend}
          value="$99,698"
          iconName="money"
        />
        <Metric
          title="Total sales"
          // value={campaign.totalSales}
          value="$123.99"
          iconName="message-add"
        />
        <Metric
          title="ROAS"
          // value={campaign.roas}
          value="4x"
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
