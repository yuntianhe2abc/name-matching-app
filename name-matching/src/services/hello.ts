import {
  APIGatewayProxyHandler,
  APIGatewayProxyEvent,
  Context,
  APIGatewayProxyResult,
} from "aws-lambda";

async function handler(event: APIGatewayProxyEvent, context: Context) {
  console.log(event);
  const abc = "adsdd";
  const response: APIGatewayProxyResult = {
    statusCode: 200,
    body: JSON.stringify(abc),
  };
  return response;
}

export { handler };
