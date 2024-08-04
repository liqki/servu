import os from "os";
import path from "path";
import { spawn } from "child_process";
import { readFromStorage } from "../utils/localStorage";
import { javaInstructions } from "../utils/getJavaVersion";
import chalk from "chalk";

const startWindows = async (location: string, detached: boolean, silent: boolean): Promise<void> => {
  return new Promise((resolve, reject) => {
    const filePath = path.join(location, "start.bat");
    const process = spawn("cmd.exe", ["/c", filePath], { cwd: location, detached });

    if (!silent) {
      process.stdout.on("data", (data) => {
        console.log(`${data}`);
      });
    }

    process.stderr.on("data", (data) => {
      console.error(`${data}`);
    });

    process.on("error", () => {
      console.log(chalk.red("Failed to start server"));
      reject();
    });

    process.on("close", (code) => {
      if (code !== 0) {
        console.log(chalk.red(`Server process exited with code ${code}`));
        reject();
      } else {
        resolve();
      }
    });
  });
};

const startLinux = async (location: string, detached: boolean, silent: boolean): Promise<void> => {};

export const start = async (server: string, detached: boolean, silent: boolean) => {
  console.log(chalk.blueBright(`Starting server ${server}`));
  const serverProperties = await readFromStorage(server);
  if (!serverProperties) {
    console.log(chalk.red(`Server ${server} does not exist`));
    return;
  }
  const { location, version, software } = serverProperties;
  const validJavaVersionInstalled = await javaInstructions(version, software);
  if (!validJavaVersionInstalled) return;
  if (os.platform() === "win32") {
    console.log(chalk.red("If this process is terminated, the server will stop"));
    await startWindows(location, detached, silent);
  } else {
    console.log(chalk.red("If this process is terminated, the server will stop"));
    console.log(chalk.red("Use screen to stop this behavior"));
    await startLinux(location, detached, silent);
  }
};
