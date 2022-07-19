# site-minder-emailer

This project contains source code and supporting files for a serverless application that you can deploy with the SAM CLI. It includes the following files and folders.

- email-service - Code for the application's Lambda function and Project Dockerfile.
- events - Invocation events that you can use to invoke the function.
- email-service/tests - Unit tests for the application code.
- template.yaml - A template that defines the application's AWS resources.

The application uses AWS resources, including Lambda functions and an API Gateway API. These resources are defined in the `template.yaml` file in this project. You can update the template to add AWS resources through the same deployment process that updates your application code.

## Configuration

The service expects third party email api credentials to send emails.

> `EmailDB` The DynamoDB table where the api requests are stored.

> `EmailProviders` The name(s) for the email api seperated by semi-colon. This will also act as the stub for other variable associates with this API.

> `<<EmailProvider defined above>>User` Username associated with the API.

> `<<EmailProvider defined above>>Pass` This secret or private key associated with this API.

> `<<EmailProvider defined above>>Path` The api endpoint without the hostname

> `<<EmailProvider defined above>>Api` The hostname of the API,

> `<<EmailProvider defined above>>Transport` This is instruct the service the medium of transportation of the request payload. The two supported options are `query` (passing data as query params in the url) and `body` (passing data as a JSON).

#### An example for Mailgun API

```sh
EmailDB=MailsProcessed
EmailProviders=Mailgun
MailgunUser=api
MailgunPass=secretmailgunpassword
MailgunPath=/v3/mydomainname.mailgun.org/messages
MailgunApi=api.mailgun.net
MailgunTransport=query
```

This can be configured using the environment vars in your lambda instance manually or use the `samconfig.toml` file at the root level. `samconfig.toml` is generated **after you deploy** when you select `y` to the question - `Save arguments to samconfig.toml`. After the file is generated, edit it and add the `parameter_overrides` line as follows. Make sure to replace the ParameterValue(s) with the your prod credentials

> parameter_overrides = "ParameterKey=MailgunPass,ParameterValue=secretmailgunpassword ParameterKey=MailgunPath,ParameterValue=/v3/mydomainname.mailgun.org/messages ParameterKey=MailgunUser,ParameterValue=api ParameterKey=MailgunApi,ParameterValue=api.mailgun.net ParameterKey=MailgunTransport,ParameterValue=query ParameterKey=EmailProviders,ParameterValue=Mailgun"

Setting testing env

For testing locally using `sam local invoke` you will need to define a set of vars as `local.json` at the root folder level. For the above Mailgun example we can define `local.json` file in the following format.

`{ "Parameters": { "EmailDB": "MailsProcessed", "EmailProviders": "Mailgun", "MailgunPass": "secretmailgunpassword", "MailgunPath": "/v3/mydomainname.mailgun.org/messages", "MailgunUser": "api", "MailgunApi": "api.mailgun.net", "MailgunTransport": "query", } }`

Unit test cases

A test-handler is provided under tests\unit. The handler will also use the above parameters to run the automated unit test cases.

## Deploy the service

The Serverless Application Model Command Line Interface (SAM CLI) is an extension of the AWS CLI that adds functionality for building and testing Lambda applications. It uses Docker to run your functions in an Amazon Linux environment that matches Lambda. It can also emulate your application's build environment and API.

To use the SAM CLI, you need the following tools.

- Docker - [Install Docker community edition](https://hub.docker.com/search/?type=edition&offering=community)
- AWS SAM CLI - [Install the SAM CLI](https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/serverless-sam-cli-install.html)

You may need the following for local testing.

- Node.js - [Install Node.js 16](https://nodejs.org/en/), including the NPM package management tool.

To build and deploy your application for the first time, run the following in your shell:

```bash
sam build
sam deploy --guided
```

The first command will build a docker image from a Dockerfile and then the source of your application inside the Docker image. The second command will package and deploy your application to AWS, with a series of prompts:

- **Stack Name**: The name of the stack to deploy to CloudFormation. This should be unique to your account and region, and a good starting point would be something matching your project name.
- **AWS Region**: The AWS region you want to deploy your app to.
- **Confirm changes before deploy**: If set to yes, any change sets will be shown to you before execution for manual review. If set to no, the AWS SAM CLI will automatically deploy application changes.
- **Allow SAM CLI IAM role creation**: Many AWS SAM templates, including this example, create AWS IAM roles required for the AWS Lambda function(s) included to access AWS services. By default, these are scoped down to minimum required permissions. To deploy an AWS CloudFormation stack which creates or modifies IAM roles, the `CAPABILITY_IAM` value for `capabilities` must be provided. If permission isn't provided through this prompt, to deploy this example you must explicitly pass `--capabilities CAPABILITY_IAM` to the `sam deploy` command.
- **Save arguments to samconfig.toml**: If set to yes, your choices will be saved to a configuration file inside the project, so that in the future you can just re-run `sam deploy` without parameters to deploy changes to your application.

You can find your API Gateway Endpoint URL in the output values displayed after deployment.

## Use AWS SAM CLI to build and test locally

Download the applicaiton using git

```bash
site-minder-emailer$ git clone https://github.com/jarakkal/email-service.git
```

Install libs

```bash
site-minder-emailer$ cd email-service
site-minder-emailer\email-service$ npm install
site-minder-emailer\email-service$ cd ..
```

Build your application with the `sam build` command.

```bash
site-minder-emailer$ sam build
```

The SAM CLI builds a docker image from a Dockerfile and then installs dependencies defined in `email-service/package.json` inside the docker image. The processed template file is saved in the `.aws-sam/build` folder.

- **Note**: The Dockerfile included in this sample application uses `npm install` by default. If you are building your code for production, you can modify it to use `npm ci` instead.

Test a single function by invoking it directly with a test event. An event is a JSON document that represents the input that the function receives from the event source. Test events are included in the `events` folder in this project.

Run functions locally and invoke them with the `sam local invoke` command.

```bash
site-minder-emailer$ sam local invoke --event events/event.json
```

The SAM CLI can also emulate your application's API. Use the `sam local start-api` to run the API locally on port 3000.

```bash
site-minder-emailer$ sam local start-api
site-minder-emailer$ curl http://localhost:3000/
```

The SAM CLI reads the application template to determine the API's routes and the functions that they invoke. The `Events` property on each function's definition includes the route and method for each path.

```yaml
Events:
  SendEmail:
    Type: Api
    Properties:
      Path: /send
      Method: POST
```

## Invoking the service

#### URL

```
The url path will be `/send`. So the full url will be for eg. http://localhost:3000/send
When using the AWS ApiGatway url, it will be /Prod/send. Eg https://<<apigateway>>.execute-api.ap-southeast-2.amazonaws.com/Prod/send/
```

#### Method

```
Only implemented the POST method for now.
```

#### Data Params

```
emailFrom: [string][required]
emailTo: [string][required]
emailSubject: [string][required][max length of 50]
emailContent: [string][required][max length of 200]
emailCc: [string][not required]
emailBcc: [string][not required]
isTesting: [boolean][not required]

The body payload should be sent in JSON. Eg

Method: POST
Body Content: { "emailTo": "jentojoy@gmail.com", "emailSubject": "a sub", "emailContent": "some body text" }
```

#### Success response

```
You should be getting a response code 200 and an id. Eg.
Code: 200
Content: { "id" : 12, "message": "success" }
```

#### Error response

```
Code: 400 Bad Request
Content: { "message" : "Invalid request body" }

Code: 400 Bad Request
Content: { "message" : "Invalid input. Please check and try again." }

```

#### Nodejs sample invocation

```

import { request } from "https";

const options = {
  'method': 'POST',
  'hostname': '<<apigateway>>.execute-api.ap-southeast-2.amazonaws.com',
  'path': '/Prod/send/',
  'headers': {
    'Content-Type': 'application/json'
  },
  'maxRedirects': 20
};

const req = request(options, function (res) {
  let chunks = [];

  res.on("data", function (chunk) {
    chunks.push(chunk);
  });

  res.on("end", function (chunk) {
    const body = Buffer.concat(chunks);
    console.log(body.toString());
  });

  res.on("error", function (error) {
    console.error(error);
  });
});

const postData = JSON.stringify({
  "emailFrom": "from@example.com",
  "emailTo": "to@example.com",
  "emailSubject": "a subject",
  "emailContent": "some email text"
});

req.write(postData);

req.end();

```

## Add a resource to your application

The application template uses AWS Serverless Application Model (AWS SAM) to define application resources. AWS SAM is an extension of AWS CloudFormation with a simpler syntax for configuring common serverless application resources such as functions, triggers, and APIs. For resources not included in [the SAM specification](https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md), you can use standard [AWS CloudFormation](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-template-resource-type-ref.html) resource types.

## Unit tests

Tests are defined in the `email-service/tests` folder in this project. Use NPM to install the [Mocha test framework](https://mochajs.org/) and run unit tests from your local machine.

```bash
site-minder-emailer$ cd email-service
email-service$ npm install
email-service$ npm run test
```

## ToDo

- Error responses: Should have more granular error response per email etc
- Authentication: Implement basic authentication
- Validations: Expand the scope of validations to texts such as subject and email content.
- Get: Add a get method to take an ID and respond with status
- Queuing: Requests should be queued, so that requests can be terminated quicker
- Rate limit: Limit api calls to prevent abuse. Also repond with the error message.
- Retry: Retry the failed api before going to try another api from the list.

## Resources

See the [AWS SAM developer guide](https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/what-is-sam.html) for an introduction to SAM specification, the SAM CLI, and serverless application concepts.
