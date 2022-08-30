import { CENTRAL_SERVICES_API_URL } from "@constants";

export default {
  validate: (vendorId: string) =>
    `${CENTRAL_SERVICES_API_URL}/vendors/${vendorId}`,
  existingCampaign: (productId: string) =>
    `${CENTRAL_SERVICES_API_URL}/products/${productId}/campaign`,
};
