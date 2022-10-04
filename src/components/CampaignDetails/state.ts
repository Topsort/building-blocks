export type Step = "details" | "ending" | "ended";

export type State = {
  step: Step;
};

export const initialState: State = {
  step: "details",
};

export type Action = {
  type:
    | "edit or end button clicked"
    | "end campaign button clicked"
    | "end campaign back button clicked";
};

export const reducer = (
  state: Readonly<State>,
  action: Readonly<Action>
): State => {
  switch (action.type) {
    case "edit or end button clicked": {
      return {
        ...state,
        // TODO: set it as "editing" once edit page is implemented
        step: "ending",
      };
    }
    case "end campaign button clicked": {
      return {
        ...state,
        step: "ended",
      };
    }
    case "end campaign back button clicked": {
      return {
        ...state,
        // TODO: set it as "editing" once edit page is implemented
        step: "details",
      };
    }
  }
};
