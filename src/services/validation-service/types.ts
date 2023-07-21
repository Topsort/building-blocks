import { ValidationResponse } from "@api/types";

export type ValidationService = {
  getValidationToken: (
    authUrl: string,
    externalVendorId: string,
    extraAuthHeaders?: Record<string, string>
  ) => Promise<ValidationResponse>;
};
