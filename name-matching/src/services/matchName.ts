import { APIGatewayProxyHandler, APIGatewayProxyEvent } from "aws-lambda";
import getBestMatch from "../openaiApiCalling/getBestMatch";
import { isValidMatch } from "../data/mockData";

// Retry function with exponential backoff
const retry = async (fn: Function, retriesLeft = 3, interval = 1000) => {
  try {
    return await fn();
  } catch (error) {
    if (retriesLeft === 0) {
      throw new Error("Max retries exceeded");
    }
    await new Promise((resolve) => setTimeout(resolve, interval));
    return retry(fn, retriesLeft - 1, interval * 2);
  }
};

const matchNameHandler: APIGatewayProxyHandler = async (
  event: APIGatewayProxyEvent
) => {
  const { name } = JSON.parse(event.body || "{}");
  if (!name) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "Name is required" }),
    };
  }

  try {
    const bestMatch = await retry(async () => {
      const match = await getBestMatch(name);
      if (!isValidMatch(match)) {
        throw new Error(
          "The person does not exist, Please check the spelling and try again"
        );
      }
      return match;
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ person: bestMatch }),
    };
  } catch (error) {
    console.error(error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Internal Server Error" }),
    };
  }
};
export { matchNameHandler };
