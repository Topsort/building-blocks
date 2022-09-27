// TODO(samet) recommendedBudget and estimatedClick will change.
export const recommendedBudgetUSD = 5;
export const minBudgetUSD = Math.floor(
  recommendedBudgetUSD - 1 - recommendedBudgetUSD * 0.25
);
export const maxBudgetUSD = Math.ceil(
  recommendedBudgetUSD + 1 + recommendedBudgetUSD * 0.25
);
export const initialDurationDays = 7;
export const minDurationDays = 1;
export const maxDurationDays = 13;
export const minEstimatedClick = 1000;
export const maxEstimatedClick = 1500;

export type Step =
  | "budget and duration"
  | "add payment"
  | "confirm"
  | "launched";

// FIXME(christopherbot) update when we can retrieve payments methods from the api
type PaymentMethod = any;

export type State = {
  step: Step;
  paymentMethods: PaymentMethod[];
  dailyBudget: number;
  durationDays: number;
};

export const initialState: State = {
  step: "budget and duration",
  paymentMethods: [],
  dailyBudget: 0,
  durationDays: 0,
};

export type Action =
  | {
      type:
        | "budget and duration next button clicked"
        | "payment form back button clicked"
        | "payment method saved"
        | "add new payment method button clicked"
        | "confirm back button clicked"
        | "campaign creation reset"
        | "campaign launched";
    }
  | {
      type: "payment methods received";
      payload: {
        paymentMethods: PaymentMethod[];
      };
    }
  | {
      type: "daily budget updated";
      payload: {
        amount: number;
      };
    }
  | {
      type: "duration days updated";
      payload: {
        days: number;
      };
    };

export const reducer = (
  state: Readonly<State>,
  action: Readonly<Action>
): State => {
  switch (action.type) {
    case "payment methods received": {
      return {
        ...state,
        paymentMethods: action.payload.paymentMethods,
      };
    }
    case "daily budget updated": {
      return {
        ...state,
        dailyBudget: action.payload.amount,
      };
    }
    case "duration days updated": {
      return {
        ...state,
        durationDays: action.payload.days,
      };
    }
    case "budget and duration next button clicked": {
      return {
        ...state,
        step: state.paymentMethods.length ? "confirm" : "add payment",
      };
    }
    case "payment form back button clicked": {
      return {
        ...state,
        step: state.paymentMethods.length ? "confirm" : "budget and duration",
      };
    }
    case "payment method saved": {
      return {
        ...state,
        step: "confirm",
      };
    }
    case "add new payment method button clicked": {
      return {
        ...state,
        step: "add payment",
      };
    }
    case "confirm back button clicked": {
      return {
        ...state,
        step: "budget and duration",
      };
    }
    case "campaign creation reset": {
      return {
        ...state,
        step: "budget and duration",
        dailyBudget: recommendedBudgetUSD,
        durationDays: initialDurationDays,
      };
    }
    case "campaign launched": {
      return { ...state, step: "launched" };
    }
  }
};
