import log from "./logger.mjs";
import { apiResponse, generatePhotoKey, isValidPhoto } from "./utils.mjs";
import { uploadPhotoToS3, addMetaDataToDynamoDb } from "./services.mjs";
("./services.mjs");
import config from "./config.mjs";

export default async (event, context) => {
  log.info("Handler triggered");
  log.debug(event, "Full event");

  const photo = event.body?.photo;

  // Check whether the user is the admin
  // This logic needs to handled by a proper way in the future
  const user = event.requestContext?.authorizer?.claims?.["cognito:username"];
  console.log(`${user}===${config.adminUser}`);
  if (user !== config.adminUser) {
    log.info("Non admin users cannot upload photos");
    return apiResponse(403, { message: `Not an admin user: ${user}` });
  }

  if (!photo) {
    // Respond 400 when client doesn't send a photo
    log.info("No photo found in the event body");
    return apiResponse(400, { message: "No photo found in the body" });
  }

  // Respond 400 when client send invalid file type
  const mimeType = photo.mimetype;
  if (!isValidPhoto(mimeType)) {
    log.info("Invalid photo type", { type: mimeType });
    return apiResponse(400, { message: `Invalid photo type ${mimeType}` });
  }

  const photoKey = generatePhotoKey(photo.filename);
  const data = { visibility: event.body?.visibility };

  // Upload photo to s3 and add photo meta data to dynamodb table
  const responses = await Promise.all([
    uploadPhotoToS3(photo, photoKey),
    addMetaDataToDynamoDb(photoKey, data),
  ]);
  log.debug(responses?.[0], "S3 response");
  log.debug(responses?.[1], "DynamoDB response");

  log.info("Photo uploaded successfully");

  log.info("Handler completed");
  return apiResponse(200, { message: "Photo uploaded" });
};
