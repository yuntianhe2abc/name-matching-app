import { OpenAI } from "openai";
import { nameList, isValidMatch } from "../data/mockData";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});
// Few-shot examples
const FEW_SHOT_TRAININ_EXAMPLES = [
  {
    input: "Can you give me a english name",
    output:
      "David Smith 大卫 斯密斯, Rodrigo Vang 罗德里戈 旺, Madisyn Murillo 麦迪辛 穆里略, Vera Bishop 维拉 毕晓普, Pierce Osborne 皮尔斯 奥斯本",
  },
  {
    input: "I am looking for a boy name",
    output:
      "Yansong Li 李岩松, David Smith 大卫 斯密斯, Pierce Osborne 皮尔斯 奥斯本, Huawen Wu 华文吴, Yueling Zhang",
  },
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
const makeQuery = async (query: string): Promise<string[]> => {
  const response = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [
      {
        role: "system",
        content:
          "You are a helpful assistant. You can help find a list of people based on the query from the people collection.",
      },
      ...trainingExamples,
      {
        role: "user",
        content: `query: ${query}, people collection: ${nameList.join(
          ", "
        )}, response with the actual people names only.`,
      },
    ],
    max_tokens: 100,
  });
  const returnedNames = response.choices[0].message.content.split(", ");
  //Keep names exist in the database
  const validNames = returnedNames.filter((name) => isValidMatch(name));
  return validNames;
};
const consistentQuery = async (query: string) => {
  // Make 3 parallel requests to OpenAI
  const [result1, result2, result3] = await Promise.all([
    makeQuery(query),
    makeQuery(query),
    makeQuery(query),
  ]);

  // Find names that appear more than 1/2 times of requests
  const nameCounts: { [name: string]: number } = {};
  const allResults = [...result1, ...result2, ...result3];

  allResults.forEach((name) => {
    nameCounts[name] = (nameCounts[name] || 0) + 1;
  });

  const queryResult = Object.keys(nameCounts).filter(
    (name) => nameCounts[name] >= 2
  );
  return queryResult;
};

export default consistentQuery;
