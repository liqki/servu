import { program } from "commander";
import { create } from "./commands/create";
import { list } from "./commands/list";
import { cleanup } from "./commands/cleanup";
import { deleteServer } from "./commands/delete";

program.name("servu").version("1.0.0", "-v, --version").helpCommand(false).description("A CLI tool to manage Minecraft servers");

program.command("create").description("Create a new Minecraft server").action(create);

program.command("list").description("List all Minecraft servers").action(list);
program.command("cleanup").description("Update your server list and remove deleted servers").action(cleanup);
program
  .command("delete <server>")
  .option("-y, --yes", "Skip confirmation prompt")
  .description("Delete a Minecraft server")
  .action((server, options) => deleteServer(server, options.yes || false));

program.parse(process.argv);
