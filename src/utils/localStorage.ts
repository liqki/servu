import fs from "fs";

// change location in production
const path = "./devdata";
const filePath = path + "/data.json";

const readJson = async () => {
  const fileContent = await new Promise<string>((resolve, reject) => {
    return fs.readFile(filePath, "utf8", (err, data) => {
      if (err) return reject(err);
      return resolve(data);
    });
  });
  if (!fileContent) return null;
  return JSON.parse(fileContent);
};

export const writeToStorage = async (
  key: string,
  value: {
    version: string;
    software: string;
    memory: number | undefined;
    location: string;
  }
) => {
  if (!fs.existsSync(filePath)) {
    if (!fs.existsSync(path)) fs.mkdirSync(path);
    fs.writeFile(filePath, JSON.stringify({ [key]: value }), (err) => console.error(err));
    return;
  }
  const data = await readJson();
  data[key] = value;
  fs.writeFile(filePath, JSON.stringify(data), (err) => console.error(err));
};

export const readFromStorage = async (key: string) => {
  if (!fs.existsSync(filePath)) return null;
  const data = await readJson();
  return data[key];
};

export const hasKey = async (key: string) => {
  if (!fs.existsSync(filePath)) return false;
  const data = await readJson();
  return data[key] !== undefined;
};
