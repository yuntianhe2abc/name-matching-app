import { App } from "aws-cdk-lib";
import { LambdaStack } from "./stacks/LambdaStack";
import { ApiStack } from "./stacks/ApiStack";
const app = new App();
const lambdaStack = new LambdaStack(app, "LambdaStack");

new ApiStack(app, "ApiStack", {
  //define an API Gateway methods:
  helloLambdaIntegration: lambdaStack.helloLambdaIntegration,
  nameMatchingLambdaIntegration: lambdaStack.nameMatchingLambdaIntegration,
});
