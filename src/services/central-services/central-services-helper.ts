import TopsortElements from "src";

import { Configuration } from "./generated/configuration";

// ToDo: (cpinto) how do i get dynamically CS Url?
const CENTRAL_SERVICES_URL = "http://localhost:8081";

export function getAccessToken(): string | undefined {
  return TopsortElements.apiToken;
}

class CentralServiceConfiguration extends Configuration {
  // This is a hack to overcome a known issue in Axios/openapigeneration that
  // serializes twice json objects.
  public override isJsonMime(): boolean {
    return false;
  }
}

export async function getConfiguration(): Promise<Configuration> {
  const accessToken = getAccessToken();
  const configuration = new CentralServiceConfiguration({
    accessToken,
    basePath: CENTRAL_SERVICES_URL,
  });
  return configuration;
}
