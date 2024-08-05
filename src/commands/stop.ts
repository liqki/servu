import chalk from "chalk";
import os from "os";
import { screenInstalled } from "../utils/installScreen";
import { readFromStorage } from "../utils/localStorage";
import { execPromise } from "../utils/execPromise";

export const stop = async (server: string) => {
  if (os.platform() !== "linux") {
    console.log(chalk.red("This command only works on linux"));
    return;
  }
  if (!(await screenInstalled())) {
    console.log(chalk.red("Screen is not installed"));
    return;
  }
  const serverProperties = await readFromStorage(server);
  if (!serverProperties) {
    console.log(chalk.red(`Server ${server} does not exist`));
    return;
  }
  try {
    await execPromise(`screen -r ${server} -X quit`);
    console.log(chalk.green(`Server ${server} stopped`));
  } catch (error) {
    console.error(error);
  }
};
