import { api } from "@api/index";
import { paths } from "@api/paths";
import * as schemas from "@api/schemas";
import { ValidationResponse } from "@api/types";
import { getHeaders } from "@services/central-services/services";

import { ValidationService } from "./types";

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