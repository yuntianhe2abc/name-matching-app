import { OpenAI } from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});
// Few-shot examples
const FEW_SHOT_TRAININ_EXAMPLES = [
  { input: "David Smith", output: "David Smith 大卫 斯密斯" },
  { input: "Zhang Yueling", output: "Yueling Zhang 月林张" },
  { input: "华文吴", output: "Huawen Wu 华文吴" },
  { input: "李安妮", output: "Annie Lee 李安妮" },
];
const trainingExamples: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = [
  ...FEW_SHOT_TRAININ_EXAMPLES.map((example) => {
    const trainingExample: OpenAI.Chat.Completions.ChatCompletionMessageParam =
      {
        role: "user",
        content: `Input: ${example.input}\nOutput: ${example.output}`,
      };
    return trainingExample;
  }),
];

// Function to process OpenAI response
const getBestMatch = async (
  name: string,
  nameList: string[]
): Promise<string> => {
  const response = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [
      {
        role: "system",
        content:
          "you are a helpful database adminstrator, when a user provide you a name, you search through the people collection to find the best match person.",
      },
      ...trainingExamples,
      {
        role: "user",
        content: `Find the best match for the input name "${name}" from the collection of people: ${nameList.join()},response with the actual person only without other content.`,
      },
    ],
    //reduce creativity in generations
    temperature: 0.3,
    max_tokens: 50,
  });
  if (!response.choices || response.choices.length === 0) {
    throw new Error("No valid response from OpenAI");
  }
  return response.choices[0].message.content;
};

export default getBestMatch;
