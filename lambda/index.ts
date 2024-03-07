import { APIGatewayProxyHandlerV2 } from "aws-lambda";
import { ListBucketsCommand, S3Client } from "@aws-sdk/client-s3";

const s3 = new S3Client({});

export const handler: APIGatewayProxyHandlerV2 = async (event, context) => {
  const list = await s3.send(new ListBucketsCommand({}));
  const liArr = list.Buckets?.map((buck) => `<li>${buck.Name}</li>`);
  const html = `<ul>${liArr?.join("\n")}</ul>`;
  return {
    body: html,
    headers: { "Content-Type": "text/html" },
    statusCode: 200,
  };
};
