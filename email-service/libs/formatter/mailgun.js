"use strict";

// Formatting function to package request data for Mailgun

export function isFormatted(inputObj) {
  if (typeof inputObj !== "object") return false;
  try {
    let inputFormatted = {
      from: inputObj.emailFrom,
      to: inputObj.emailTo,
      subject: inputObj.emailSubject,
      text: inputObj.emailContent,
    };
    if (inputObj.emailCc) inputFormatted.cc = inputObj.emailCc;
    if (inputObj.emailBcc) inputFormatted.bcc = inputObj.emailBcc;
    if (inputObj.isTesting) inputFormatted["o:testmode"] = true;
    return inputFormatted;
  } catch (err) {
    return false;
  }
}
