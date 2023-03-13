import middy from "@middy/core";
import httpHeaderNormalizer from "@middy/http-header-normalizer";
import httpErrorHandler from "@middy/http-error-handler";

import lambdaHandler from "./handler.mjs";

export const handler = middy(lambdaHandler);
handler.use(httpHeaderNormalizer()).use(httpErrorHandler());
