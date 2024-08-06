import fs from "fs";
import os from "os";
import { ServerProperties } from "./types";

const path = os.homedir();
export const filePath = path + "/.servu";

export const readStorage = async () => {
  const fileContent = await new Promise<string>((resolve, reject) => {
    return fs.readFile(filePath, "utf8", (err, data) => {
      if (err) return reject(err);
      return resolve(data);
    });
  });
  if (!fileContent) return null;
  return JSON.parse(fileContent);
};

export const writeToStorage = async (key: string, value: ServerProperties) => {
  if (!fs.existsSync(filePath)) {
    if (!fs.existsSync(path)) fs.mkdirSync(path);
    fs.writeFile(filePath, JSON.stringify({ [key]: value }), (err) => console.error(err));
    return;
  }
  const data = await readStorage();
  data[key] = value;
  fs.writeFileSync(filePath, JSON.stringify(data));
};

export const readFromStorage = async (key: string): Promise<ServerProperties | null> => {
  if (!fs.existsSync(filePath)) return null;
  const data = await readStorage();
  return data[key];
};

export const hasKey = async (key: string) => {
  if (!fs.existsSync(filePath)) return false;
  const data = await readStorage();
  return data[key] !== undefined;
};

export const deleteFromStorage = async (key: string) => {
  if (!fs.existsSync(filePath)) return;
  const data = await readStorage();
  delete data[key];
  fs.writeFileSync(filePath, JSON.stringify(data));
};
