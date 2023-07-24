import { Campaign } from "@api/types";
import { Button } from "@components/Button";
import { Icon } from "@components/Icon";
import { ModalContent, ModalHeading } from "@components/Modal";
import { CampaignSummary } from "@components/common";
import { useProductPromotion } from "@context";
import { h, FunctionComponent, Fragment } from "preact";

import { Metrics } from "./Metrics";

export const CampaignEnded: FunctionComponent<{ campaign: Campaign }> = ({
  campaign,
}) => {
  const { dispatch } = useProductPromotion();
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
          <Metrics title="Final Metrics" campaign={campaign} />
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
