export default {
  validate: (vendorId: string) =>
    `${CENTRAL_SERVICES_PUBLIC_URL}/auth/vendors/${vendorId}`,
  vendorProducts: (vendorId: string) =>
    `${CENTRAL_SERVICES_URL}/vendors/${vendorId}/products`,
};
