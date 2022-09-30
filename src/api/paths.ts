export default {
  products: (vendorId: string) =>
    `${CENTRAL_SERVICES_URL}/vendors/${vendorId}/products`,
  validate: (vendorId: string) =>
    `${CENTRAL_SERVICES_PUBLIC_URL}/auth/vendors/${vendorId}`,
};
