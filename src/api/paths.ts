// ToDo: somehow fetch central-services URL from build
const CENTRAL_SERVICES_URL = "https://whatever-central-services";

export default {
  validate: (vendorId: string) =>
    `${CENTRAL_SERVICES_URL}/validate/${vendorId}`,
};
