import { APIGatewayProxyHandler, APIGatewayProxyEvent } from "aws-lambda";
import getBestMatch from "../utils/getBestMatch";

const nameList = [
  "David Smith 大卫 斯密斯",
  "Yueling Zhang 月林张",
  "Huawen Wu 华文吴",
  "Annie Lee 李安妮",
  "Yansong Li 李岩松",
  "Rodrigo Vang 罗德里戈 旺",
  "Madisyn Murillo 麦迪辛 穆里略",
  "Vera Bishop 维拉 毕晓普",
  "Pierce Osborne 皮尔斯 奥斯本",
];

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

// Function to validate if the response matches exactly with one of the names in namesList
const isValidMatch = (response: string): boolean => {
  return nameList.some((name) => name.includes(response.trim()));
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
      const match = await getBestMatch(name, nameList);
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
