import { confirm, input, select, Separator } from "@inquirer/prompts";
import ora from "ora";
import chalk from "chalk";
import fs from "fs";
import path from "path";
import { downloadServerSoftware } from "../utils/downloadServerSoftware";
import { hasKey, writeToStorage } from "../utils/localStorage";
import { javaInstructions } from "../utils/getJavaVersion";

const userInput = async () => {
  const serverInfo = {
    name: await input({
      message: "Enter the name of the server",
      default: "server",
      validate: async (input) => {
        if (input.length === 0 || input.length > 16) return "Server name must be between 1 and 16 characters";
        if (input.includes(" ")) return "Server name cannot contain spaces";
        if (await hasKey(input)) return "Server with that name already exists";
        return true;
      },
    }),
    version: await input({
      message: "Enter the version of the server",
      default: await fetch("https://papermc.io/api/v2/projects/paper")
        .then((res: any) => res.json())
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
      ],
      default: "vanilla",
    }),
    memory: await input({
      message: "Enter the amount of memory (in MB) to allocate to the server",
      default: "2048",
    }),
    location: await input({
      message: "Enter the location to save the server files (a subdirectory named after the server will be created)",
      default: ".",
    }),
  };

  return serverInfo;
};

const acceptEula = async () => {
  const eula = await confirm({
    message: "Do you accept the Minecraft EULA? (https://www.minecraft.net/en-us/eula)",
    default: true,
  });
  return eula;
};

const createStartScript = (absolutePath: string, memory: string) => {
  const os = process.platform;
  const script = os === "win32" ? "start.bat" : "start.sh";
  fs.writeFileSync(
    path.join(absolutePath, script),
    os === "win32"
      ? `java -Xmx${memory}M -Xms${memory}M -jar server.jar nogui`
      : // TODO: create linux start script
        `java -Xmx${memory}M -Xms${memory}M -jar server.jar nogui`
  );
  if (os !== "win32") fs.chmodSync(path.join(absolutePath, script), "755");
};

export const create = async () => {
  console.log(chalk.bold("Create a new Minecraft server"));
  const { name, version, software, memory, location } = await userInput();
  const absolutePath = path.resolve(path.join(location, name));

  const spinner = ora("Fetching server software").start();
  await downloadServerSoftware(software, version, absolutePath);
  spinner.succeed("Server software downloaded");

  await writeToStorage(name, { version, software, memory, location: absolutePath });

  let eula = await acceptEula();
  while (!eula) {
    console.log(chalk.redBright("You must accept the EULA to create a server"));
    eula = await acceptEula();
  }
  fs.writeFileSync(path.join(absolutePath, "eula.txt"), "eula=true");

  createStartScript(absolutePath, memory);

  console.log(chalk.greenBright("Server created successfully"));
  const validJavaVersionInstalled = await javaInstructions(version, software);
  if (validJavaVersionInstalled) console.log(chalk.blueBright("Run the server using the command: " + chalk.bgGrey(`servu run ${name}`)));
  process.exit(0);
};
