"use strict";

// Formatting request for POST

export async function getOptions(inputObj, service) {
  if (typeof inputObj !== "object") return false;
  try {
    const inputFormatter = await import(
      `./libs/formatter/${service.toLowerCase()}.js`
    );
    let serviceUser = `${service}User`;
    let servicePass = `${service}Pass`;
    let serviceApi = `${service}Api`;
    let servicePath = `${service}Path`;
    let serviceTransport = `${service}Transport`;
    let inputFormatted;
    const auth =
      "Basic " +
      Buffer.from(
        process.env[serviceUser] + ":" + process.env[servicePass]
      ).toString("base64");

    inputObj.emailSubject = JSON.stringify(inputObj.emailSubject).slice(0, 50);

    inputObj.emailContent = JSON.stringify(inputObj.emailContent).slice(0, 200);

    inputFormatted = inputFormatter.isFormatted(inputObj);

    let ops = {
      hostname: process.env[serviceApi],
      path: process.env[servicePath],
      method: "POST",
      port: 443,
      headers: {
        "Content-Type": "application/json",
        Authorization: auth,
      },
    };

    // adding email information to ops object
    switch (process.env[serviceTransport]) {
      case "query":
        ops.path += "?" + new URLSearchParams(inputFormatted).toString();
      case "body":
        ops.body = inputFormatted;
    }

    return ops;
  } catch (err) {
    return { err: new Error(err) };
  }
}
