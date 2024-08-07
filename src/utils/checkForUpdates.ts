import { $ } from "bun";
import os from "os";
import chalk from "chalk";
import ora from "ora";

const getLatestRelease = async (): Promise<string> => {
  const response = await fetch("https://api.github.com/repos/liqki/servu/releases/latest");
  const json: any = await response.json();
  return json.tag_name;
};

export const checkForUpdates = async () => {
  const currentVersion = require("../../package.json").version;
  const latestVersion = await getLatestRelease();
  if ("v" + currentVersion !== latestVersion) {
    console.log(chalk.blackBright(`A new version of servu is available: ${latestVersion}`));
    console.log(chalk.blueBright("Run " + chalk.bgGrey("servu update -y") + " to update"));
  } else console.log(chalk.green("You're using the latest version of servu"));
};

export const update = async () => {
  const currentVersion = require("../../package.json").version;
  const latestVersion = await getLatestRelease();
  if ("v" + currentVersion === latestVersion) return console.log(chalk.green("You're already using the latest version of servu"));
  const spinner = ora("Updating servu").start();
  try {
    if (os.platform() === "win32") await $`Set-ExecutionPolicy Unrestricted -Scope Process; iex (iwr "https://raw.githubusercontent.com/liqki/servu/main/scripts/install.ps1").Content`;
    else {
      const location = (await $`which servu`.text()).split("/").slice(0, -1).join("/");
      await $`curl -s https://raw.githubusercontent.com/liqki/servu/main/scripts/install.sh | bash -s -- -d ${location}`;
    }
    spinner.succeed("servu updated successfully");
  } catch (error) {
    spinner.fail("Failed to update servu");
  }
};
