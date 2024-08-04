import ora from "ora";
import os from "os";
import path from "path";
import { exec } from "child_process";
import { readFromStorage } from "../utils/localStorage";
import { javaInstructions } from "../utils/getJavaVersion";

export const start = async (server: string) => {
  const spinner = ora(`Starting server ${server}\n`).start();
  const file = os.platform() === "win32" ? "start.bat" : "start.sh";
  const serverProperties = await readFromStorage(server);
  if (!serverProperties) {
    spinner.fail(`Server ${server} not found`);
    return;
  }
  const { location, version, software } = serverProperties;
  const validJavaVersionInstalled = await javaInstructions(version, software);
  if (!validJavaVersionInstalled) {
    spinner.fail("Java version not compatible");
    return;
  }
  // TODO: not working currently
  exec(`"${path.join(location, file)}"`, (error) => {
    if (error) {
      spinner.fail(`Failed to start server ${server}`);
      return;
    }
  });
  spinner.succeed(`Server ${server} started`);
};
