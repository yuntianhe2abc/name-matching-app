import { Stack, StackProps } from "aws-cdk-lib";
import { LambdaIntegration, RestApi } from "aws-cdk-lib/aws-apigateway";
import { Construct } from "constructs";

interface ApiStackProps extends StackProps {
  readonly helloLambdaIntegration: LambdaIntegration;
  readonly nameMatchingLambdaIntegration: LambdaIntegration;
  readonly openNameMatchLambdaIntegration: LambdaIntegration;
}
export class ApiStack extends Stack {
  constructor(scope: Construct, id: string, props?: ApiStackProps) {
    super(scope, id, props);
    const exactMatchApi = new RestApi(this, "NameMatchingApi");
    const nameMatchResource = exactMatchApi.root.addResource("exactMatch");
    nameMatchResource.addMethod("GET", props.helloLambdaIntegration);
    nameMatchResource.addMethod("POST", props.nameMatchingLambdaIntegration);

    //api for open queries
    const openMatchApi = new RestApi(this, "openMatchApi");
    const openMatchResource = openMatchApi.root.addResource("openMatch");
    openMatchResource.addMethod("POST", props.openNameMatchLambdaIntegration);
  }
}
