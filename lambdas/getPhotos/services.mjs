import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import {
  DynamoDBClient,
  ScanCommand,
  QueryCommand,
} from "@aws-sdk/client-dynamodb";

import config from "./config.mjs";

export const getS3SignedUrl = async (key, options = { expiresIn: 3600 }) => {
  const params = {
    Bucket: config.photoS3Bucket,
    Key: key,
  };

  const client = new S3Client();
  return await getSignedUrl(client, new GetObjectCommand(params), options);
};

export const getAllItemsFromPhotoTable = async () => {
  const params = {
    TableName: config.photoDynamoDbTable,
  };

  const dynamoDBClient = new DynamoDBClient();
  const response = await dynamoDBClient.send(new ScanCommand(params));
  return response.Items;
};
