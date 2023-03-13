import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { DynamoDBClient, PutItemCommand } from "@aws-sdk/client-dynamodb";

import config from "./config.mjs";

// Upload photo to S3 with the given key
export const uploadPhotoToS3 = async (photo, key) => {
  const params = {
    Bucket: config.photoS3Bucket,
    Key: key,
    Body: photo.content,
    ContentType: photo.mimetype,
  };
  const s3 = new S3Client();
  return await s3.send(new PutObjectCommand(params));
};

// Add photo meta data to DynamoDB table
export const addMetaDataToDynamoDb = async (key, data) => {
  const params = {
    TableName: config.photoDynamoDbTable,
    Item: {
      photoKey: { S: key },
      visibility: { S: data.visibility },
    },
  };
  const dynamoDb = new DynamoDBClient();
  return await dynamoDb.send(new PutItemCommand(params));
};
