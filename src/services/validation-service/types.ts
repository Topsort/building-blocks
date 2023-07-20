import { ValidationResponse } from "@api/types";

export type ValidationService = {
  getValidationToken: (
    authUrl: string,
    apiKey: string,
    externalVendorId: string
  ) => Promise<ValidationResponse>;
};
