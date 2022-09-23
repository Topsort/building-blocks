// ToDo: somehow fetch central-services URL from build
const CENTRAL_SERVICES_PUBLIC_URL =
  "http://localhost:5001/public/v1/elements-service";
// const CENTRAL_SERVICES_PRIVATE_URL = "http://localhost:5001/elements-service";

export default {
  validate: (vendorId: string) =>
    `${CENTRAL_SERVICES_PUBLIC_URL}/auth/vendors/${vendorId}`,
};
