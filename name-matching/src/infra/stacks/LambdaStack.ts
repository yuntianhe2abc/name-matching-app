import { Stack, StackProps } from "aws-cdk-lib";
import { LambdaIntegration } from "aws-cdk-lib/aws-apigateway";
import {
  Code,
  Function as LambdaFunction,
  Runtime,
} from "aws-cdk-lib/aws-lambda";
import { Construct } from "constructs";
import { join } from "path";

export class LambdaStack extends Stack {
  public readonly helloLambdaIntegration: LambdaIntegration;
  public readonly nameMatchingLambdaIntegration: LambdaIntegration;

  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);
    const helloLambda = new LambdaFunction(this, "HelloLambda", {
      runtime: Runtime.NODEJS_18_X,
      handler: "hello.main",
      code: Code.fromAsset(join(__dirname, "..", "..", "services")),
    });
    this.helloLambdaIntegration = new LambdaIntegration(helloLambda);
    // NameMatching Lambda function
    const nameMatchingLambda = new LambdaFunction(this, "NameMatchingLambda", {
      runtime: Runtime.NODEJS_18_X,
      handler: "nameMatching.main",
      code: Code.fromAsset(join(__dirname, "..", "..", "services")),
    });
    this.nameMatchingLambdaIntegration = new LambdaIntegration(
      nameMatchingLambda
    );
  }
}
