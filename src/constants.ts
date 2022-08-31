/* Text */
export const defaultText = {
  promoteButton: "Promote",
  modalTitle: "Create Campaign",
  modalSubtitle: "Quickly launch a campaign for this product.",
  modalCampaignNamePlaceholder: "Enter your campaign name",
  detailButton: "See Campaign",
};

/* DOM Targets */
export const portalRootId = "ts-elements-portal-root";
export const defaultPromoteTargetClassName = "ts-promote-target";

export const CENTRAL_SERVICES_URL = "http://localhost:5001"; // ToDo: somehow inject central-services URL from build
export const CENTRAL_SERVICES_API_PATH = "/public/v1/elements-service";
export const CENTRAL_SERVICES_API_URL = `${CENTRAL_SERVICES_URL}${CENTRAL_SERVICES_API_PATH}`;
