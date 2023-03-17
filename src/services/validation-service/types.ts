import { ValidationResponse } from "@api/types";

export type ValidationService = {
  getValidationToken: (
    apiKey: string,
    externalVendorId: string
  ) => Promise<ValidationResponse>;
};
