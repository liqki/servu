import ora from "ora";
import fs from "fs";
import { deleteFromStorage, readFromStorage } from "../utils/localStorage";
import { confirm } from "@inquirer/prompts";
import chalk from "chalk";

export const deleteServer = async (server: string, skipConfirmation: boolean) => {
  if (!skipConfirmation) {
    const confirmDelete = await confirm({
      message: "Are you sure you want to delete the server?",
      default: true,
    });
    if (!confirmDelete) {
      console.log(chalk.green("Server not deleted"));
      process.exit(0);
    }
  }
  const spinner = ora("Deleting server").start();
  const serverProperties = await readFromStorage(server);
  if (!serverProperties) {
    spinner.fail("Server not found");
    return;
  }
  if (serverProperties.location) {
    spinner.info("Removing server files");
    if (fs.existsSync(serverProperties.location)) {
      fs.rmSync(serverProperties.location, { recursive: true });
    }
  }
  await deleteFromStorage(server);
  spinner.succeed("Server deleted");
  process.exit(0);
};
