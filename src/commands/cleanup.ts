import ora from "ora";
import fs from "fs";
import { filePath, readStorage } from "../utils/localStorage";

export const cleanup = async () => {
  const spinner = ora("Cleaning up").start();
  const servers = await readStorage();
  if (!servers) {
    spinner.fail("No servers found");
    return;
  }
  let deleted = 0;
  for (const server in servers) {
    if (!fs.existsSync(servers[server].location)) {
      delete servers[server];
      deleted++;
    }
  }
  if (deleted === 0) spinner.info("No servers to cleanup");
  else {
    fs.writeFileSync(filePath, JSON.stringify(servers));
    spinner.succeed("Cleanup complete - removed " + deleted + " server(s)");
  }
  process.exit(0);
};
