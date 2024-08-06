import chalk from "chalk";
import os from "os";
import { readStorage } from "../utils/localStorage";
import { screenInstalled } from "../utils/installScreen";
import { execPromise } from "../utils/execPromise";

export const list = async () => {
  const servers = await readStorage();
  if (!servers || Object.keys(servers).length === 0) {
    console.log(chalk.redBright("No servers found"));
    return;
  }
  console.log(chalk.bold("Your servers:\n"));
  for (const server in servers) {
    const { software, version, memory } = servers[server];
    if (os.platform() === "linux" && (await screenInstalled())) {
      const { stdout } = await execPromise("screen -ls").catch(() => ({ stdout: "" }));
      if (stdout.includes(server)) {
        console.log(chalk`  {bold ${server}} - ${software} ${version} (${memory}MB)` + chalk.green(" (running in background)"));
        continue;
      }
    }
    console.log(chalk`  {bold ${server}} - ${software} ${version} (${memory}MB)`);
  }
  console.log(chalk.blueBright("\nIf there are servers listed that no longer exist, you should run " + chalk.bgGrey("servu cleanup")));
};
