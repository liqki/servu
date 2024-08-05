import chalk from "chalk";
import os from "os";
import { screenInstalled } from "../utils/installScreen";
import { readFromStorage } from "../utils/localStorage";
import { execPromise } from "../utils/execPromise";

const sessionExists = async (sessionName: string): Promise<boolean> => {
  try {
    const { stdout } = await execPromise("screen -ls");
    return stdout.includes(sessionName);
  } catch (error) {
    console.error(chalk.red("There was an error running the command"));
    return false;
  }
};

export const attach = async (server: string) => {
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
  if (!(await sessionExists(server))) return console.log(chalk.red(`Server ${server} is not running`));
  try {
    // TODO: command always failing
    await execPromise(`screen -r ${server}`);
  } catch (error) {
    // console.log(chalk.red(`Failed to attach to server ${server}`));
    console.error(error);
  }
};
