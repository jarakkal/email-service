import { PutItemCommand } from "@aws-sdk/client-dynamodb";
import { ddbClient } from "./client.js";
import { createTable } from "./create-table.js";

export const addItem = async (data) => {
  try {
    if (process.env.AWS_SAM_LOCAL) {
      // Create the table in the test container
      // const tableCreated = await createTable();
      // console.log("table created ", tableCreated);
    }
    // console.log("dynamo db add");
    // console.log("data got ", data);

    const reqDate = new Date().toLocaleString().replace(",", "");
    const params = {
      TableName: process.env.EmailDB,
      Item: {
        SendId: { S: data.sendId },
        From: { S: data.fromAddress },
        AttemptedOn: { S: reqDate },
        Status: { S: data.sendStatus },
      },
    };
    const itemAdded = await ddbClient.send(new PutItemCommand(params));
    // console.log("item addded ", itemAdded);
    return itemAdded;
  } catch (err) {
    console.error(err);
    return err;
  }
};
