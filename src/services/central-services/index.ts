import { services as mockServices } from "@services/central-services/mock";
import { services as realServices } from "@services/central-services/services";

export const services =
  USE_MOCK_SERVER === "true" ? mockServices : realServices;
