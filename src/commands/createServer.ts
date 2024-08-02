import { input, number, select, Separator } from "@inquirer/prompts";
import ora from "ora";
import chalk from "chalk";
import { downloadServerSoftware } from "../utils/downloadServerSoftware";

const userInput = async () => {
  const serverInfo = {
    name: await input({
      message: "Enter the name of the server",
      default: "server",
      validate: (input) => {
        if (input.length === 0 || input.length > 16) return "Server name must be between 1 and 16 characters";
        if (input.includes(" ")) return "Server name cannot contain spaces";
        return true;
      },
    }),
    version: await input({
      message: "Enter the version of the server",
      default: await fetch("https://papermc.io/api/v2/projects/paper")
        .then((res) => res.json())
        .then((data) => data.versions.pop()),
    }),
    software: await select({
      message: "Select the server software",
      choices: [
        { name: "Vanilla", value: "vanilla" },
        new Separator(chalk.bold("-- Plugins --")),
        { name: "Paper", value: "paper" },
        { name: "Spigot", value: "spigot" },
        new Separator(chalk.bold("-- Mods --")),
        { name: "Fabric", value: "fabric" },
        { name: "Forge", value: "forge" },
      ],
      default: "vanilla",
    }),
    memory: await number({
      message: "Enter the amount of memory (in MB) to allocate to the server",
      default: 2048,
    }),
    location: await input({
      message: "Enter the location to save the server files (a subdirectory named after the server will be created)",
      default: ".",
    }),
  };

  return serverInfo;
};

export const createServer = async () => {
  console.log(chalk.bold("Create a new Minecraft server"));
  const { name, version, software, memory, location } = await userInput();

  const spinner = ora("Fetching server software").start();
  await downloadServerSoftware(software, version, location);
  spinner.succeed("Server software downloaded");
};
