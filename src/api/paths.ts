export const paths = {
  campaign: (
    centralServicesUrl: string,
    vendorId: string,
    campaignId: string
  ) =>
    `${centralServicesUrl}/modal-service/vendors/${vendorId}/campaigns/${campaignId}`,
  campaigns: (centralServicesUrl: string, vendorId: string) =>
    `${centralServicesUrl}/modal-service/vendors/${vendorId}/campaigns`,
  marketplaceDetails: (centralServicesUrl: string) =>
    `${centralServicesUrl}/modal-service/vendors/marketplace-details`,
  defaultBudget: (centralServicesUrl: string, vendorId: string) =>
    `${centralServicesUrl}/modal-service/vendors/${vendorId}/default-budget`,
  products: (centralServicesUrl: string, vendorId: string) =>
    `${centralServicesUrl}/modal-service/vendors/${vendorId}/products`,
  validate: (authUrl: string, vendorId: string) =>
    `${authUrl}/auth/vendors/${vendorId}`,
};
