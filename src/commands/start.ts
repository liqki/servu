import os from "os";
import path from "path";
import { spawn } from "child_process";
import { readFromStorage } from "../utils/localStorage";
import { javaInstructions } from "../utils/getJavaVersion";
import chalk from "chalk";

const startWindows = async (location: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    const filePath = path.join(location, "start.bat");
    const process = spawn("cmd.exe", ["/c", filePath]);

    process.stdout.on("data", (data) => {
      console.log(data);
    });

    process.stderr.on("data", (data) => {
      console.error(data);
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
        console.log(chalk.greenBright("Server started successfully"));
        resolve();
      }
    });
  });
};

export const start = async (server: string) => {
  // const spinner = ora(`Starting server ${server}\n`).start();
  const serverProperties = await readFromStorage(server);
  if (!serverProperties) {
    // spinner.fail(`Server ${server} not found`);
    return;
  }
  const { location, version, software } = serverProperties;
  const validJavaVersionInstalled = await javaInstructions(version, software);
  if (!validJavaVersionInstalled) {
    // spinner.fail("Java version not compatible");
    return;
  }
  // TODO: not working currently
  if (os.platform() === "win32") {
    await startWindows(location);
  }

  // spinner.succeed(`Server ${server} started`);
};
