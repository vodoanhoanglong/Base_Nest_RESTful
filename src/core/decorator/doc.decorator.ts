import { ApiExtraModels, ApiOkResponse, getSchemaPath } from "@nestjs/swagger";
import { BaseResponse } from "@shared/helper/response";

export function ApiExtraModelsCustom(...models: Function[]) {
  return ApiExtraModels(BaseResponse, ...models);
}

export function ApiResponseCustom(ref?: string | Function, isArray = false) {
  return ApiOkResponse({
    description: "Successful Response",
    schema: {
      allOf: [
        { $ref: getSchemaPath(BaseResponse) },
        {
          properties: {
            data: ref
              ? isArray
                ? { type: "array", items: { $ref: getSchemaPath(ref) } }
                : { $ref: getSchemaPath(ref) }
              : { example: null },
            error: { example: null },
          },
        },
      ],
    },
  });
}
