import { Stack, StackProps } from "aws-cdk-lib";
import { LambdaIntegration } from "aws-cdk-lib/aws-apigateway";
import { Runtime } from "aws-cdk-lib/aws-lambda";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";
import { Construct } from "constructs";
import { join } from "path";

export class LambdaStack extends Stack {
  public readonly helloLambdaIntegration: LambdaIntegration;
  public readonly nameMatchingLambdaIntegration: LambdaIntegration;
  public readonly openNameMatchLambdaIntegration: LambdaIntegration;

  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);
    const helloLambda = new NodejsFunction(this, "HelloLambda", {
      runtime: Runtime.NODEJS_18_X,
      handler: "handler",
      entry: join(__dirname, "..", "..", "services", "hello.ts"),
    });
    this.helloLambdaIntegration = new LambdaIntegration(helloLambda);
    // NameMatching Lambda function
    const nameMatchingLambda = new NodejsFunction(this, "NameMatchingLambda", {
      runtime: Runtime.NODEJS_18_X,
      handler: "matchNameHandler",
      entry: join(__dirname, "..", "..", "services", "matchName.ts"),
    });
    this.nameMatchingLambdaIntegration = new LambdaIntegration(
      nameMatchingLambda
    );

    // openNameQuery Lambda function
    const openNameMatchLambda = new NodejsFunction(
      this,
      "openNameMatchLambda",
      {
        runtime: Runtime.NODEJS_18_X,
        handler: "openNameMatchHandler",
        entry: join(__dirname, "..", "..", "services", "openNameMatch.ts"),
      }
    );
    this.openNameMatchLambdaIntegration = new LambdaIntegration(
      openNameMatchLambda
    );
  }
}
