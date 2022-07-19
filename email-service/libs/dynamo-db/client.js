// Create service client module using ES6 syntax.
import { DynamoDB } from "@aws-sdk/client-dynamodb";
// Set AWS Params
const params = {
  region: "ap-southeast-2",
  apiVersion: "2012-08-10",
};
if (process.env.AWS_SAM_LOCAL) {
  params.region = "local";
  params.endpoint = "http://docker.for.mac.localhost:8000";
}

// Create an Amazon DynamoDB service client object.
const ddbClient = new DynamoDB(params);

export { ddbClient };
