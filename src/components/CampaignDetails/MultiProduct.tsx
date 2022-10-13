import { Link } from "@components/Link";
import { CampaignSummary } from "@components/common";
import { h, FunctionalComponent } from "preact";

export const MultiProduct: FunctionalComponent = () => {
  return (
    <div>
      <CampaignSummary />
      <span className="ts-multi-product__message ts-text-sm">
        Please{" "}
        <Link href="https://app.topsort.com/">log into your dashboard</Link> or
        contact your admin for more information.
      </span>
    </div>
  );
};
