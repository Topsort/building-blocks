import { Button } from "@components/Button";
import { Icon } from "@components/Icon";
import { RangeInputWithTooltip } from "@components/Input";
import { ModalContent, ModalHeading } from "@components/Modal";
import { Tooltip } from "@components/Tooltip";
import { h, FunctionalComponent, Fragment } from "preact";
import { ChangeEvent, StateUpdater } from "preact/compat";
import { useState } from "preact/hooks";

type Step = "budget and duration" | "confirm";

// TODO(christopherbot) what should these be?
const minBudgetUSD = 1;
const maxBudgetUSD = 1000;
const minDurationDays = 1;
const maxDurationDays = 100;

const BudgetAndDuration: FunctionalComponent<{
  dailyBudget: number;
  durationDays: number;
  setDailyBudget: StateUpdater<number>;
  setDurationDays: StateUpdater<number>;
}> = ({ dailyBudget, durationDays, setDailyBudget, setDurationDays }) => {
  return (
    <Fragment>
      <div className="ts-flex ts-space-x-2">
        <span className="ts-text-md ts-font-medium">Budget and duration</span>
        <Tooltip
          content="The average amount you're willing to spend on your ads & the length of days you want the ads to show"
          align="bottom"
        >
          <Icon name="message-question" />
        </Tooltip>
      </div>
      <div className="ts-campaign-creation__range">
        <span className="ts-text-sm ts-font-medium">Set a daily budget</span>
        <RangeInputWithTooltip
          value={dailyBudget}
          min={minBudgetUSD}
          max={maxBudgetUSD}
          onInput={(event: ChangeEvent<HTMLInputElement>) => {
            // Casting needing due to preact bug:
            // https://github.com/preactjs/preact/issues/1930
            setDailyBudget(Number((event.target as HTMLInputElement).value));
          }}
          tooltipProps={{
            // TODO(christopherbot) use marketplace's currency:
            content: `${dailyBudget} USD`,
            alwaysShow: true,
            light: true,
          }}
        />
      </div>
      <div className="ts-campaign-creation__range">
        <span className="ts-text-sm ts-font-medium">Set a duration</span>
        <RangeInputWithTooltip
          value={durationDays}
          min={minDurationDays}
          max={maxDurationDays}
          onInput={(event: ChangeEvent<HTMLInputElement>) => {
            // Casting needing due to preact bug:
            // https://github.com/preactjs/preact/issues/1930
            setDurationDays(Number((event.target as HTMLInputElement).value));
          }}
          tooltipProps={{
            // TODO(christopherbot) use marketplace's currency:
            content: `${durationDays} Days`,
            alwaysShow: true,
            light: true,
          }}
        />
      </div>
      <div className="ts-callout ts-flex ts-items-center ts-campaign-creation__details-callout ts-space-x-4">
        <Icon name="info-circle" className="ts-rotate-180" />
        <span className="ts-text-sm ts-font-semimedium">
          We are going to promote your product in a way that you can make
          profits!
        </span>
      </div>
    </Fragment>
  );
};

const Confirm: FunctionalComponent<{
  dailyBudget: number;
  durationDays: number;
}> = ({ dailyBudget, durationDays }) => {
  return (
    <div className="ts-space-y-8">
      <div className="ts-callout ts-flex ts-items-center ts-space-x-4">
        <img
          className="ts-product-image ts-product-image--md"
          src="https://picsum.photos/76"
        />
        <span className="ts-font-medium">Too faced hangover primer</span>
      </div>
      <div className="ts-space-y-2">
        <span className="ts-block ts-text-md ts-font-medium">
          Budget and duration
        </span>
        <span className="ts-block ts-text-sm ts-font-medium">
          ${dailyBudget} over {durationDays} days.
        </span>
        <span className="ts-block ts-min-roas">
          Your minimum return on ad spend is <span>4x</span>.
        </span>
      </div>
      <div className="ts-space-y-2">
        <span className="ts-block ts-text-md ts-font-medium">
          Payment method
        </span>
        {/*
         * TODO(christopherbot) placeholder until we build a picker
         * and/or finalize how payments will work.
         */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            border: "1px solid #cecece",
            height: "3rem",
            padding: "0 1rem",
            borderRadius: "0.75rem",
          }}
        >
          **** **** **** 1234
        </div>
        <Button variant="inline">+ Add new payment method</Button>
      </div>
    </div>
  );
};

export const CampaignCreation: FunctionalComponent<{
  productId: string | null;
}> = () => {
  const [step, setStep] = useState<Step>("budget and duration");
  const [dailyBudget, setDailyBudget] = useState(400);
  const [durationDays, setDurationDays] = useState(7);

  return (
    <Fragment>
      <ModalHeading>
        {step === "budget and duration"
          ? "Promote a product"
          : "Confirm details"}
      </ModalHeading>
      <ModalContent>
        <div className="ts-campaign-creation">
          {step === "budget and duration" ? (
            <BudgetAndDuration
              dailyBudget={dailyBudget}
              setDailyBudget={setDailyBudget}
              durationDays={durationDays}
              setDurationDays={setDurationDays}
            />
          ) : (
            <Confirm dailyBudget={dailyBudget} durationDays={durationDays} />
          )}
          <div className="ts-campaign-creation__footer ts-space-x-2">
            {step === "budget and duration" ? (
              <Button variant="contained" onClick={() => setStep("confirm")}>
                Next
              </Button>
            ) : (
              <Fragment>
                <Button
                  variant="outlined"
                  onClick={() => setStep("budget and duration")}
                >
                  Back
                </Button>
                <Button
                  variant="contained"
                  onClick={() => console.log("TODO: Launch campaign")}
                >
                  Launch
                </Button>
              </Fragment>
            )}
          </div>
        </div>
      </ModalContent>
    </Fragment>
  );
};
