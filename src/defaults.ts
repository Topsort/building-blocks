// Text
export const defaultText = {
  button: "Promote",
  modalTitle: "Create Campaign",
  modalSubtitle: "Quickly launch a campaign for this product.",
  modalCampaignNamePlaceholder: "Enter your campaign name",
};

// Targets
export const portalRootId = "ts-elements-portal-root";
export const defaultPromoteTargetClassName = "ts-promote-target";

// Styles
export const modalClassName = "ts-promote-modal";
export const defaultModalStyles = [
  "position: fixed;",
  "top: 50%;",
  "left: 50%;",
  "transform: translate(-50%, -50%);",
  "height: 20rem;",
  "max-height: 85vh;",
  "padding: 1rem;",
  "border: 1px solid black;",
  "border-radius: 0.5rem;",
  "background-color: white;",
  "box-shadow: 0px 5px 8px rgb(0 0 0 / 10%);",
  "z-index: 1;",
];
export const modalShowClassName = "ts-promote-modal--show";
export const modalShowStyles = ["display: block;"];
export const modalHideClassName = "ts-promote-modal--hide";
export const modalHideStyles = ["display: none;"];

export const modalCloseButtonClassName = "ts-promote-modal__close-button";
export const modalCloseButtonStyles = [
  "position: absolute;",
  "top: 0.5rem;",
  "right: 0.5rem;",
  "cursor: pointer;",
];

export const campaignCreationClassName = "ts-campaign-creation";
export const campaignCreationStyles = [
  "display: flex;",
  "flex-direction: column;",
  "align-items: center;",
];

export const buttonClassName = "ts-product-promote-button";
export const defaultButtonStyles = [
  "cursor: pointer;",
  "border-radius: 0.25rem;",
  "background-color: #DDD6FF;",
  "position: absolute;",
  "bottom: 0.5rem;",
  "right: 0.5rem;",
];

export const buttonTextClassName = "ts-product-promote-button-text";
export const defaultButtonTextStyles = ["color: #00042A;", "font-weight: 600;"];
