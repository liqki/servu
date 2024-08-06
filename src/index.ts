import { program } from "commander";
import os from "os";
import { create } from "./commands/create";
import { list } from "./commands/list";
import { cleanup } from "./commands/cleanup";
import { deleteServer } from "./commands/delete";
import { start } from "./commands/start";
import { stop } from "./commands/stop";
import { attach } from "./commands/attach";

program.name("servu").version("1.0.0", "-v, --version").helpCommand(false).description("A CLI tool to manage Minecraft servers");

program.command("create").description("Create a new Minecraft server").action(create);
program
  .command("start <server>")
  .alias("run")
  .option("-d, --detached", `${os.platform() === "linux" ? "Run the server in the background (screen only)" : "Run the server in another window"}`)
  .option("-s, --silent", "Hide the server log")
  .description("Start a Minecraft server")
  .action((server, options) => start(server, options.detached || false, options.silent || false));

program.command("debug").action(() => console.log(process.env.USERPROFILE));

if (os.platform() === "linux") {
  program
    .command("stop <server>")
    .description("Stop a server that's running in the background (screen only)")
    .action((server) => stop(server));
  program
    .command("attach <server>")
    .description("Attach to a server console running in the background (screen only)")
    .action((server) => attach(server));
}

program.command("list").description("List all Minecraft servers").action(list);
program.command("cleanup").description("Update your server list and remove deleted servers").action(cleanup);
program
  .command("delete <server>")
  .option("-y, --yes", "Skip confirmation prompt")
  .description("Delete a Minecraft server")
  .action((server, options) => deleteServer(server, options.yes || false));

program.parse(process.argv);
