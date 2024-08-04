import { resolve } from "bun";
import chalk from "chalk";
import fs from "fs";
import https from "https";

const validateVersion = async (version: string): Promise<boolean> => {
  const { versions } = await fetch("https://launchermeta.mojang.com/mc/game/version_manifest.json").then((res: any) => res.json());
  return versions.find((v: { id: string }) => v.id === version);
};

export const downloadServerSoftware = async (software: string, version: string, location: string) => {
  const validVersion = await validateVersion(version);
  if (!validVersion) {
    console.log(chalk.red("\nInvalid version specified"));
    return process.exit(0);
  }
  const downloadUrl = await getDownloadUrl(software, version);
  if (!downloadUrl) {
    console.log(chalk.red("\nFailed to get download URL for the specified software and version"));
    return process.exit(0);
  }
  await download(downloadUrl, location);
};

const download = async (url: string, location: string) => {
  if (!fs.existsSync(location)) fs.mkdirSync(location, { recursive: true });
  return new Promise((resolve, reject) => {
    const filePath = `${location}/server.jar`;
    const file = fs.createWriteStream(filePath);

    https
      .get(url, (res) => {
        res.pipe(file);

        file.on("finish", () => {
          file.close(resolve);
        });

        file.on("error", (err) => {
          fs.unlink(filePath, () => reject(err));
        });

        res.on("error", (err) => {
          fs.unlink(filePath, () => {
            reject(err);
          });
        });
      })
      .on("error", (err) => {
        fs.unlink(filePath, () => reject(err));
      });
  });
};

const getDownloadUrl = async (software: string, version: string): Promise<string> => {
  switch (software) {
    case "vanilla":
      const { versions } = await fetch("https://launchermeta.mojang.com/mc/game/version_manifest.json").then((res: any) => res.json());
      const release = versions.find((v: { type: string; id: string }) => v.type === "release" && v.id === version);
      if (!release) return "";
      const { downloads } = await fetch(release.url).then((res: any) => res.json());
      return downloads.server.url;
    case "paper":
      const { builds } = await fetch(`https://papermc.io/api/v2/projects/paper/versions/${version}/builds`).then((res: any) => res.json());
      const latestBuild = builds[builds.length - 1].build;
      return `https://papermc.io/api/v2/projects/paper/versions/${version}/builds/${latestBuild}/downloads/paper-${version}-${latestBuild}.jar`;
    case "fabric":
      return `https://meta.fabricmc.net/v2/versions/loader/${version}/0.15.11/1.0.1/server/jar`;
    default:
      return "";
  }
};
