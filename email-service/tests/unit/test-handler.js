"use strict";

import { lambdaHandler } from "../../app.js";
import { expect } from "chai";
import { readFile } from "fs/promises";

let mockEvent = {
  body: {
    emailFrom: "jentojoy@gmail.com",
    emailTo: "jentojoy@gmail.com",
    emailSubject: "test a sub",
    emailContent: "test some body text",
    isTesting: true,
  },
};

let context;

describe("Tests index", function () {
  before(async () => {
    const testEnv = JSON.parse(
      await readFile(new URL("../../../local.json", import.meta.url))
    );
    Object.entries(testEnv.Parameters).forEach(
      ([key, value]) => (process.env[key] = value)
    );
  });

  it("Mailgun: verifies successful response", async () => {
    const result = await lambdaHandler(mockEvent, context);
    expect(result).to.be.an("object");
    expect(result.statusCode).to.be.an("number");
    expect(result.statusCode).to.be.equal(200);
    expect(result.body).to.be.an("string");
    const respObj = JSON.parse(result.body);
    expect(respObj.message).to.be.equal("success");
  });
});
