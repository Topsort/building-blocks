import { CampaignWithReport } from "@api/types";
import { CampaignBudget, CampaignSummary } from "@components/common";
import { MS_PER_DAY } from "@constants";
import { usePromotionContext } from "@context";
import { Fragment, FunctionalComponent } from "preact";
import { useMemo } from "preact/hooks";

import { Metrics, ShopMetrics } from "./Metrics";
import { SalesClicksChart } from "@components/Chart";

export const Details: FunctionalComponent<{
  campaign: CampaignWithReport;
  isShopCampaign?: boolean;
}> = ({ campaign, isShopCampaign = false }) => {
  const days = useMemo(() => {
    const end = new Date(campaign.endDate);

    if (end.getUTCFullYear() === 9999) {
      return "infinite";
    }

    const start = new Date(campaign.startDate);
    const timeDiff = end.getTime() - start.getTime();
    return Math.round(timeDiff / MS_PER_DAY);
  }, [campaign.startDate, campaign.endDate]);

  return (
    <Fragment>
      {isShopCampaign ? (
        <ShopCampaignDetails campaign={campaign} days={days} />
      ) : (
        <ProductCampaignDetails campaign={campaign} days={days} />
      )}
    </Fragment>
  );
};

const ProductCampaignDetails: FunctionalComponent<{
  campaign: CampaignWithReport;
  days: number | "infinite";
}> = ({ campaign, days }) => {
  const { dispatch } = usePromotionContext();

  return (
    <div className="ts-space-y-3-5">
      <CampaignSummary startDate={campaign.startDate} />
      <CampaignBudget
        budget={campaign.budget?.amount}
        days={days}
        onEdit={() => dispatch({ type: "edit campaign button clicked" })}
      />
      <hr className="ts-hr" />
      <Metrics title="Metrics" campaignReport={campaign.report} />
    </div>
  );
};

const ShopCampaignDetails: FunctionalComponent<{
  campaign: CampaignWithReport;
  days: number | "infinite";
}> = ({ campaign, days }) => {
  const { dispatch } = usePromotionContext();

  return (
    <div className="ts-space-y-3-5">
      <ShopMetrics campaignReport={campaign.report} />
      <SalesClicksChart campaignId={campaign.campaignId} />
      <hr className="ts-hr" />
      <CampaignBudget
        budget={campaign.budget?.amount}
        days={days}
        onEdit={() => dispatch({ type: "edit campaign button clicked" })}
      />
    </div>
  );
};
