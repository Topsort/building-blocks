import { ValidationResponse } from "@api/types";

export type ValidationService = {
  getValidationToken: (
    authUrl: string,
    externalVendorId: string,
    bearerToken?: string
  ) => Promise<ValidationResponse>;
};
