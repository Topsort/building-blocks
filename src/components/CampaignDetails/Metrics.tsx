import { Icon, IconName } from "@components/Icon";
import { Campaign } from "@types";
import { h, FunctionalComponent } from "preact";

export const Metrics: FunctionalComponent<{
  campaign: Campaign;
  title: string;
}> = ({ campaign, title }) => {
  return (
    <div className="ts-campaign-details-metrics">
      <span className="ts-campaign-metrics-title">{title}</span>
      <div class="ts-metrics-grid">
        <Metric
          title="Impressions"
          value={campaign.impressions}
          iconName="eye"
        />
        <Metric
          title="Clicks"
          value={campaign.clicks}
          iconName="mouse-square"
        />
        <Metric title="Purchases" value={campaign.purchases} iconName="bag" />
        <Metric
          title="Total spend"
          value={campaign.totalSpend}
          iconName="money"
        />
        <Metric
          title="Total sales"
          value={campaign.totalSales}
          iconName="message-add"
        />
        <Metric title="ROAS" value={campaign.roas} iconName="back-square" />
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
      <div className="ts-metric-content">
        <span className="ts-metric-title">{title}</span>
        <span className="ts-metric-value">{value}</span>
      </div>
    </div>
  );
};
