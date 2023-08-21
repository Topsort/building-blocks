import { api } from "@api/index";
import { paths } from "@api/paths";
import * as schemas from "@api/schemas";
import { ValidationResponse } from "@api/types";
import { getAuthHeaders } from "@services/central-services/services";

import { ValidationService } from "./types";

async function getValidationToken(
  authUrl: string,
  externalVendorId: string,
  extraAuthHeaders?: Record<string, string>
): Promise<ValidationResponse> {
  return await api({
    schema: schemas.validationSchema,
    url: paths.validate(authUrl, externalVendorId),
    config: {
      method: "GET",
      headers: getAuthHeaders(extraAuthHeaders),
    },
  });
}

export const validationService: ValidationService = {
  getValidationToken,
};
