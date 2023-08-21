import { ReportDataWithAuctions } from "@api/types";
import { Button } from "@components/Button";
import { Icon } from "@components/Icon";
import { ModalContent, ModalHeading } from "@components/Modal";
import { CampaignSummary } from "@components/common";
import { usePromotionContext } from "@context";
import { FunctionComponent, Fragment } from "preact";

import { Metrics } from "./Metrics";

export const CampaignEnded: FunctionComponent<{
  campaignReport: ReportDataWithAuctions;
}> = ({ campaignReport }) => {
  const { dispatch } = usePromotionContext();
  const title = (
    <Fragment>
      <Icon size={32} name="tick-circle" className="ts-text-success" />
      <span>Your campaign ended!</span>
    </Fragment>
  );
  return (
    <Fragment>
      <ModalHeading title={title} />
      <ModalContent height="fit-content">
        <div className="ts-space-y-5">
          <CampaignSummary />
          <Metrics title="Final Metrics" campaignReport={campaignReport} />
          <Button
            fullWidth
            variant="contained"
            onClick={() => dispatch({ type: "modal close button clicked" })}
          >
            Close
          </Button>
        </div>
      </ModalContent>
    </Fragment>
  );
};
