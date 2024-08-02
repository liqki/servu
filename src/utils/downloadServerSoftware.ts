import fs from "fs";
import https from "https";

export const downloadServerSoftware = async (software: string, version: string, location: string) => {
  const downloadUrl = await getDownloadUrl(software, version);
  if (!downloadUrl) throw new Error("Could not find download URL");
  download(downloadUrl, location);
};

const download = async (url: string, location: string) => {
  if (!fs.existsSync(location)) fs.mkdirSync(location, { recursive: true });
  const file = fs.createWriteStream(`${location}/server.jar`);
  https.get(url, (res) => {
    res.pipe(file);
    file.on("finish", () => {
      file.close();
    });
  });
};

const getDownloadUrl = async (software: string, version: string): Promise<string> => {
  return "";
};
