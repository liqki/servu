import chalk from "chalk";
import ora from "ora";
import { execPromise } from "./execPromise";

export const screenInstalled = async (): Promise<boolean> => {
  try {
    await execPromise("screen --version");
    return true;
  } catch {
    return false;
  }
};

export const installScreen = async () => {
  if (await screenInstalled()) return console.log(chalk.green("Screen already installed"));
  const spinner = ora("Installing screen").start();
  let installCommand = "";

  // TODO: test if working
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
