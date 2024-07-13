export const nameList = [
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
// Function to validate if the response matches exactly with one of the names in namesList
export const isValidMatch = (response: string): boolean => {
  return nameList.some((name) => name.includes(response.trim()));
};
