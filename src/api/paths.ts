export const paths = {
  campaign: (vendorId: string, campaignId: string) =>
    `${CENTRAL_SERVICES_BASE_URL}/modal-service/vendors/${vendorId}/campaigns/${campaignId}`,
  campaigns: (vendorId: string) =>
    `${CENTRAL_SERVICES_BASE_URL}/modal-service/vendors/${vendorId}/campaigns`,
  marketplaceDetails: () =>
    `${CENTRAL_SERVICES_BASE_URL}/modal-service/vendors/marketplace-details`,
  defaultBudget: (vendorId: string) =>
    `${CENTRAL_SERVICES_BASE_URL}/modal-service/vendors/${vendorId}/default-budget`,
  paymentMethods: () =>
    `${CENTRAL_SERVICES_BASE_URL}/payment-service/payment_methods`,
  products: (vendorId: string) =>
    `${CENTRAL_SERVICES_BASE_URL}/modal-service/vendors/${vendorId}/products`,
};
