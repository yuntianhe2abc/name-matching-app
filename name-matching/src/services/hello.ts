import {
  APIGatewayProxyEvent,
  Context,
  APIGatewayProxyResult,
} from "aws-lambda";

async function handler(event: APIGatewayProxyEvent, context: Context) {
  console.log(event);
  const response: APIGatewayProxyResult = {
    statusCode: 200,
    body: JSON.stringify("Hello from Hello Lambda function"),
  };
  return response;
}

export { handler };
