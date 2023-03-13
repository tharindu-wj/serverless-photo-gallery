import middy from "@middy/core";
import httpHeaderNormalizer from "@middy/http-header-normalizer";
import httpMultipartBodyParser from "@middy/http-multipart-body-parser";
import httpErrorHandler from "@middy/http-error-handler";

import lambdaHandler from "./handler.mjs";

export const handler = middy(lambdaHandler);
handler
  .use(httpHeaderNormalizer())
  .use(httpMultipartBodyParser())
  .use(httpErrorHandler());
