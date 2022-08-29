// ToDo: somehow fetch central-services URL from build
const CENTRAL_SERVICES_URL = "http://localhost:5001/public/v1/elements-service";

export default {
  validate: (vendorId: string) => `${CENTRAL_SERVICES_URL}/vendors/${vendorId}`,
};
