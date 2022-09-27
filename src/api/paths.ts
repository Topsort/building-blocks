export default {
  validate: (vendorId: string) =>
    `${CENTRAL_SERVICES_PUBLIC_URL}/auth/vendors/${vendorId}`,
};
