import { APIGatewayProxyHandler, APIGatewayProxyEvent } from "aws-lambda";
import consistentQuery from "../openaiApiCalling/consistentOpenQuery";

const openNameMatchHandler: APIGatewayProxyHandler = async (
  event: APIGatewayProxyEvent
) => {
  const { query } = JSON.parse(event.body || "{}");

  if (!query) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "Query is required" }),
    };
  }
  const matchedNames = await consistentQuery(query);
  try {
    if (matchedNames.length === 0) {
      return {
        statusCode: 404,
        body: JSON.stringify({ error: "No match names found." }),
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ names: matchedNames }),
    };
  } catch (error) {
    console.error(error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Internal Server Error" }),
    };
  }
};

export { openNameMatchHandler };
