import {
  APIGatewayProxyHandler,
  APIGatewayProxyEvent,
  Context,
  APIGatewayProxyResult,
} from "aws-lambda";
import { OpenAI } from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const namesList = [
  "David Smith 大卫 斯密斯",
  "Yueling Zhang 月林张",
  "Huawen Wu 华文吴",
  "Annie Lee 李安妮",
];

//First try of OpenAi API calling
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
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content:
            "you are a helpful database adminstrator, when a user provide you a name, you search through the people collection to find the best match person.",
        },
        {
          role: "user",
          content: `Find the best match for the input name "${name}" from the list: ${namesList.join()},response with the actual person only without other content.`,
        },
      ],
      max_tokens: 50,
    });

    const bestMatch = response.choices[0].message.content;
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
