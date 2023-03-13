import log from "./logger.mjs";
import { apiResponse, isProtectedRoute } from "./utils.mjs";
import { getAllItemsFromPhotoTable, getS3SignedUrl } from "./services.mjs";
("./services.mjs");

export default async (event, context) => {
  log.info("Handler triggered");
  log.debug(event, "Full event");

  const items = await getAllItemsFromPhotoTable();

  const promises = items.map(async (item) => {
    const url = await getS3SignedUrl(item.photoKey.S);
    return { key: item.photoKey.S, visibility: item.visibility.S, url };
  });

  const allPhotos = await Promise.all(promises);

  let dataToBeSend = allPhotos;

  // Need to send only public images when request from the public route
  if (!isProtectedRoute(event)) {
    dataToBeSend = allPhotos.filter((item) => item.visibility === "public");
  }

  log.info("Handler completed");
  return apiResponse(200, { data: dataToBeSend });
};
