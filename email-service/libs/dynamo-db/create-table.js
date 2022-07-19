import { CreateTableCommand } from "@aws-sdk/client-dynamodb";
import { ddbClient } from "./client.js";
const params = {
  TableName: "MailsProcessed",
  AttributeDefinitions: [
    // required attributes to be used as keys
    {
      AttributeName: "SendId",
      AttributeType: "S",
    },
    {
      AttributeName: "From",
      AttributeType: "S",
    },
  ],
  KeySchema: [
    {
      AttributeName: "SendId",
      KeyType: "HASH",
    },
    {
      AttributeName: "From",
      KeyType: "RANGE",
    },
  ],
  ProvisionedThroughput: {
    ReadCapacityUnits: 5, // Eventually Consistent Model
    WriteCapacityUnits: 5,
  },
};
export async function createTable() {
  try {
    const tableCreated = await ddbClient.send(new CreateTableCommand(params));

    return tableCreated;
  } catch (err) {
    console.log("Error", err);
  }
}
