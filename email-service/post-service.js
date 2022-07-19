"use strict";

// https service to make POST calls

import { request } from "https";

export function sendRequest(options) {
  return new Promise((resolve, reject) => {
    let bodyData;
    if (options.body) {
      bodyData = options.body;
      delete options.body;
    }
    const req = request(options, (res) => {
      let rawData = "";
      let resp;
      res.on("data", (chunk) => {
        rawData += chunk;
      });
      res.on("end", () => {
        try {
          const respObj = JSON.parse(rawData);
          res.statusCode !== 200 ? reject(respObj) : resolve(respObj);
        } catch (err) {
          reject(new Error(err));
        }
      });
    });

    req.on("error", (err) => {
      reject(new Error(err));
    });

    // write the body to the Request object
    if (bodyData) req.write(JSON.stringify(bodyData));
    req.end();
  });
}
