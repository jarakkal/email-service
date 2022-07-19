"use strict";

// Basic validations for input params

export function isValid(input) {
  let inputObj, validInput;
  let emailTest = (email) => /\S+@\S+\.\S+/.test(email);
  try {
    inputObj = typeof input === "object" ? input : JSON.parse(input);
    validInput =
      inputObj.emailTo &&
      emailTest(inputObj.emailTo) &&
      inputObj.emailFrom &&
      emailTest(inputObj.emailFrom) &&
      inputObj.emailSubject &&
      inputObj.emailSubject.length > 3 &&
      inputObj.emailContent &&
      inputObj.emailContent.length > 10 &&
      (!inputObj.emailCc || emailTest(inputObj.emailCc)) &&
      (!inputObj.emailBcc || emailTest(inputObj.emailBcc))
        ? inputObj
        : false;
    return validInput;
  } catch (err) {
    return false;
  }
}
