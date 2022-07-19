"use strict";

// Service to send emails using multiple APIs until a successful response.

import { getOptions } from "./format-options.js";
import { sendRequest } from "./post-service.js";

export async function sendMail(validInput) {
  let result,
    resp = {};
  const services = process.env.EmailProviders
    ? process.env.EmailProviders.split(";").filter((s) => s)
    : [];
  let statusMsg;

  for (const service of services) {
    try {
      const options = await getOptions(validInput, service);
      const serviceId = service.toLowerCase();
      result = await sendRequest(options);
      if (result && typeof result === "object") {
        if (result.message) {
          // Mailgun response
          statusMsg = result.message.toLowerCase().includes("queued")
            ? "success"
            : result.message;
          if (result.id)
            resp.id = `${serviceId}-${result.id.replace(/[<>]/g, "")}`;
        } else if (result.Messages) {
          // Mailjet response
          statusMsg = result.Messages[0].Status;
          if (statusMsg === "success" && result.Messages[0].To[0].MessageID)
            resp.id = `${serviceId}-${result.Messages[0].To[0].MessageID}`;
        }
        resp.message = statusMsg;
      }
      if (resp.id) break;
    } catch (err) {
      resp.message = err;
    }
  }
  return resp;
}
