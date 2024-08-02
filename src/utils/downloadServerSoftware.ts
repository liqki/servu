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
  switch (software) {
    case "vanilla":
      const { versions } = await fetch("https://launchermeta.mojang.com/mc/game/version_manifest.json").then((res) => res.json());
      const release = versions.find((v: { type: string; id: string }) => v.type === "release" && v.id === version);
      if (!release) return "";
      const { downloads } = await fetch(release.url).then((res) => res.json());
      return downloads.server.url;
    case "paper":
      const { builds } = await fetch(`https://papermc.io/api/v2/projects/paper/versions/${version}/builds`).then((res) => res.json());
      const latestBuild = builds[builds.length - 1].build;
      return `https://papermc.io/api/v2/projects/paper/versions/${version}/builds/${latestBuild}/downloads/paper-${version}-${latestBuild}.jar`;
    case "spigot":
      return ``;
    case "fabric":
      return ``;
    case "forge":
      return ``;
    default:
      return "";
  }
};
