export const apiResponse = (
  statusCode,
  body,
  headers = { "Content-Type": "application/json" }
) => ({
  statusCode,
  body: JSON.stringify(body),
  headers,
});

export const isProtectedRoute = (event) =>
  Boolean(event.requestContext?.authorizer);
