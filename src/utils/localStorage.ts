import fs from "fs";

export const writeToStorage = (key: string, value: any) => {
  // change location in production
  fs.writeFile("./devdata/data.json", JSON.stringify({ [key]: value }), (err) => console.error(err));
};
