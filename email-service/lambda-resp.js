"use strict";

// API gateway integrated response format

export function integratedResp(input, statCode = 200) {
  let result = {
    isBase64Encoded: false,
    statusCode: statCode,
    body: "",
    headers: {
      "content-type": "application/json",
    },
  };
  try {
    result.body = JSON.stringify(input);
    return result;
  } catch (err) {
    result.body = JSON.stringify({ message: "Error formatting response" });
    return result;
  }
}
