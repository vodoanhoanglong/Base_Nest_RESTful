import { ApiExtraModels, ApiOkResponse, getSchemaPath } from "@nestjs/swagger";
import { BaseResponse } from "@shared/helper/response";

export function ApiExtraModelsCustom(...models: Function[]) {
  return ApiExtraModels(BaseResponse, ...models);
}

export function ApiResponseCustom(ref?: string | Function) {
  return ApiOkResponse({
    description: "Successful Response",
    schema: {
      allOf: [
        { $ref: getSchemaPath(BaseResponse) },
        {
          properties: {
            data: ref ? { $ref: getSchemaPath(ref) } : { example: null },
            error: { example: null },
          },
        },
      ],
    },
  });
}
