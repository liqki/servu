import util from "util";
import { exec } from "child_process";
import chalk from "chalk";
import ora from "ora";

const execPromise = util.promisify(exec);

const screenInstalled = async (): Promise<boolean> => {
  try {
    await execPromise("screen --version");
    console.log(chalk.green("Screen already installed"));
    return true;
  } catch {
    return false;
  }
};

export const installScreen = async () => {
  if (await screenInstalled()) return;
  const spinner = ora("Installing screen").start();
  let installCommand = "";

  // determine package manager to update installation command
  const { stdout: osRelease } = await execPromise("cat /etc/os-release");
  if (osRelease.includes("Ubuntu") || osRelease.includes("Debian")) {
    installCommand = "sudo apt-get update && sudo apt-get install -y screen";
  } else if (osRelease.includes("CentOS") || osRelease.includes("Fedora") || osRelease.includes("Red Hat")) {
    installCommand = "sudo yum install -y screen";
  } else {
    return console.log(chalk.red("Unsupported distro"));
  }

  try {
    await execPromise(installCommand);
    spinner.succeed("Screen installed");
  } catch (error) {
    spinner.fail("Failed to install screen");
    console.error(error);
  }
};
