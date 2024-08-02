import chalk from "chalk";
import { exec } from "child_process";

const getJavaVersion = async (): Promise<string | null> => {
  exec("java -version", (error, stdout, stderr) => {
    if (error) {
      return null;
    }
    const versionOutput = stderr || stdout;
    const versionMatch = versionOutput.match(/version "(.*)"/);
    if (versionMatch && versionMatch[1]) {
      return versionMatch[1];
    }
  });
  return null;
};

const getRequiredJavaVersion = (mcVersion: string, serverSoftware: string): number => {
  if ((serverSoftware === "forge" || serverSoftware === "fabric") && parseInt(mcVersion.split(".")[1]) <= 16) {
    return 8;
  }
  if ((serverSoftware === "vanilla" || serverSoftware === "paper" || serverSoftware === "spigot") && parseInt(mcVersion.split(".")[1]) <= 16) {
    return 11;
  }
  if (parseInt(mcVersion.split(".")[1]) === 17) {
    return 16;
  }
  if (parseInt(mcVersion.split(".")[1]) >= 18 && parseInt(mcVersion.split(".")[1]) <= 19) {
    return 17;
  }
  return 21;
};

export const javaInstructions = async (mcVersion: string, serverSoftware: string): Promise<boolean> => {
  const javaVersion = await getJavaVersion();
  if (!javaVersion) {
    console.log(chalk.red("Java is not installed"));
    console.log(chalk.red("The java runtime is required to run a Minecraft server"));
    console.log(chalk.red("For this server version, you need at least " + chalk.blue("Java " + getRequiredJavaVersion(mcVersion, serverSoftware))));
    console.log(chalk.blue("Java can be downloaded from https://adoptium.net"));
    return false;
  }
  const majorVersion = parseInt(javaVersion.split(".")[0]);
  if (majorVersion < getRequiredJavaVersion(mcVersion, serverSoftware)) {
    console.log(chalk.red("The installed java version is too old"));
    console.log(chalk.red("For this server version, you need at least " + chalk.blue("Java " + getRequiredJavaVersion(mcVersion, serverSoftware))));
    console.log(chalk.blue("Java can be downloaded from https://adoptium.net"));
    return false;
  } else {
    console.log(chalk.green("The installed java version is compatible with this server version"));
    return true;
  }
};
