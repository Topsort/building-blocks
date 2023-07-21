import { api } from "@api/index";
import { paths } from "@api/paths";
import * as schemas from "@api/schemas";
import { ValidationResponse } from "@api/types";
import { getHeaders } from "@services/central-services/services";

import { ValidationService } from "./types";

async function getValidationToken(
  authUrl: string,
  externalVendorId: string,
  bearerToken?: string
): Promise<ValidationResponse> {
  return await api(
    schemas.validationSchema,
    paths.validate(authUrl, externalVendorId),
    {
      method: "GET",
      headers: getHeaders(bearerToken),
    }
  );
}

export const validationService: ValidationService = {
  getValidationToken,
};
