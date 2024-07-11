import { Stack, StackProps } from "aws-cdk-lib";
import { LambdaIntegration, RestApi } from "aws-cdk-lib/aws-apigateway";
import { Construct } from "constructs";

interface ApiStackProps extends StackProps {
  readonly helloLambdaIntegration: LambdaIntegration;
  readonly nameMatchingLambdaIntegration: LambdaIntegration;
}
export class ApiStack extends Stack {
  constructor(scope: Construct, id: string, props?: ApiStackProps) {
    super(scope, id, props);
    const api = new RestApi(this, "NameMatchingApi");
    const nameMatchingResource = api.root.addResource("nameMatching");
    nameMatchingResource.addMethod("GET", props.helloLambdaIntegration);
    nameMatchingResource.addMethod("POST", props.nameMatchingLambdaIntegration);
  }
}
