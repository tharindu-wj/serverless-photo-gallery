import { v4 as uuidv4 } from "uuid";

export const apiResponse = (
  statusCode,
  body,
  headers = { "Content-Type": "application/json" }
) => ({ statusCode, body: JSON.stringify(body), headers });

export const generatePhotoKey = (fileName) => `${uuidv4()}-${fileName}`;

export const isValidPhoto = (mimeType) => {
  const validTypes = ["image/bmp", "image/jpeg", "image/x-png", "image/png"];
  return validTypes.includes(mimeType);
};
