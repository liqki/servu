import os from "os";
import path from "path";
import { spawn } from "child_process";
import readline from "readline";
import fs from "fs";
import { readFromStorage } from "../utils/localStorage";
import { javaInstructions } from "../utils/getJavaVersion";
import chalk from "chalk";

const startServer = async (location: string, detached: boolean, silent: boolean, name: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    let filePath;
    let serverProcess;
    if (os.platform() === "win32") {
      filePath = path.join(location, "start.bat");
      serverProcess = spawn("cmd.exe", ["/c", filePath], { cwd: location, detached });
    } else {
      filePath = detached ? path.join(location, "start-screen.sh") : path.join(location, "start.sh");
      if (!fs.existsSync(filePath)) filePath = path.join(location, "start.sh");
      serverProcess = spawn("sh", [filePath], { cwd: location });
      if (filePath === path.join(location, "start-screen.sh")) {
        console.log(chalk.blueBright("The server is running in the background."));
        console.log(chalk.blueBright("Use " + chalk.bgGrey("servu list") + " to see the status or reattach to the console using " + chalk.bgGrey(`servu attach ${name}`)));
        return process.exit(0);
      }
    }
    const input = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    if (!silent) {
      serverProcess.stdout.on("data", (data) => {
        console.log(`${data}`);
      });
    }

    input.on("line", (line) => {
      serverProcess.stdin.write(`${line}\n`);
    });

    serverProcess.stderr.on("data", (data) => {
      console.error(`${data}`);
    });

    serverProcess.on("error", () => {
      console.log(chalk.red("Failed to start server"));
      reject();
    });

    serverProcess.on("close", (code) => {
      if (code !== 0) {
        console.log(chalk.red(`Server process exited with code ${code}`));
        reject(process.exit(0));
      } else {
        resolve(process.exit(0));
      }
    });

    process.on("SIGINT", () => {
      console.log("Received SIGINT. Exiting...");
      input.close();
      serverProcess.kill("SIGINT");
      process.exit(0);
    });
  });
};

export const start = async (server: string, detached: boolean, silent: boolean) => {
  const serverProperties = await readFromStorage(server);
  if (!serverProperties) {
    console.log(chalk.red(`Server ${server} does not exist`));
    return;
  }
  console.log(chalk.blueBright(`Starting server ${server}`));
  const { location, version, software } = serverProperties;
  const validJavaVersionInstalled = await javaInstructions(version, software);
  if (!validJavaVersionInstalled) return;
  await startServer(location, detached, silent, server);
};
