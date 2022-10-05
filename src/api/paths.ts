export default {
  campaign: (vendorId: string, campaignId: string) =>
    `${CENTRAL_SERVICES_BASE_URL}/modal-service/vendors/${vendorId}/campaigns/${campaignId}`,
  paymentMethods: () =>
    `${CENTRAL_SERVICES_BASE_URL}/payment-service/payment_methods`,
  products: (vendorId: string) =>
    `${CENTRAL_SERVICES_BASE_URL}/modal-service/vendors/${vendorId}/products`,
  validate: (vendorId: string) =>
    `${CENTRAL_SERVICES_BASE_URL}/public/v1/modal-service/auth/vendors/${vendorId}`,
};
