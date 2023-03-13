export const apiResponse = (statusCode, body, headers = {}) => ({
  statusCode,
  body: JSON.stringify(body),
  headers,
});

export const isProtectedRoute = (event) =>
  Boolean(event.requestContext?.authorizer);
