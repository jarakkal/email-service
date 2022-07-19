"use strict";

// Formatting function to package request data for Mailjet

export function isFormatted(inputObj) {
  if (typeof inputObj !== "object") return false;
  try {
    let inputFormatted = {
      Messages: [
        {
          From: {
            Email: inputObj.emailFrom,
          },
          To: [
            {
              Email: inputObj.emailTo,
            },
          ],
          Subject: inputObj.emailSubject,
          TextPart: inputObj.emailContent,
        },
      ],
    };
    if (inputObj.emailCc)
      inputFormatted.Messages[0].Cc = [
        {
          Email: inputObj.emailCc,
        },
      ];

    if (inputObj.emailBcc)
      inputFormatted.Messages[0].Cc = [
        {
          Email: inputObj.emailBcc,
        },
      ];

    return inputFormatted;
  } catch (err) {
    return false;
  }
}
