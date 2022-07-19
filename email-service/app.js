"use strict";

import { sendMail } from "./email-service.js";
import { isValid } from "./validate-params.js";
import { addItem } from "./libs/dynamo-db/put-item.js";
import { integratedResp } from "./lambda-resp.js";

export async function lambdaHandler(event) {
  try {
    let validInput = event && event.body ? isValid(event.body) : false;

    let sendMailRes = validInput
      ? await sendMail(validInput)
      : {
          message: "Invalid input. Please check and try again.",
        };

    let dbUpdate = await addItem({
      sendId: sendMailRes.id ? sendMailRes.id : "",
      fromAddress: validInput.emailFrom,
      sendStatus: sendMailRes.message,
    });

    return integratedResp(sendMailRes);
  } catch (error) {
    console.error("Error is: ", error);
    return integratedResp(
      {
        message: error.message,
      },
      400
    );
  }
}
