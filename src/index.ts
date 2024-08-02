import { program } from "commander";
import { createServer } from "./commands/createServer";

program.name("servu").version("1.0.0", "-v, --version").helpCommand(false).description("A CLI tool to manage Minecraft servers");

program.command("create").description("Create a new Minecraft server").action(createServer);

program.parse(process.argv);
