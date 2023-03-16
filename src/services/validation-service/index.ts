import { api } from "@api/index";
import { paths } from "@api/paths";
import * as schemas from "@api/schemas";
import { ValidationResponse } from "@api/types";

import { ValidationService } from "./types";

function getHeaders(token: string) {
  return {
    authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };
}

async function getValidationToken(
  apiKey: string,
  externalVendorId: string
): Promise<ValidationResponse> {
  return await api(schemas.validationSchema, paths.validate(externalVendorId), {
    method: "GET",
    headers: getHeaders(apiKey),
  });
}

export const validationService: ValidationService = {
  getValidationToken,
};
