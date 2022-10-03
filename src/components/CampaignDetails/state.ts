export type Step = "details" | "ending";

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
      // TODO set step as "ended" once "campaign ended" page is implemented
      return state;
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
