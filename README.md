# servu

A cross-platform CLI tool to create and manage minecraft servers.

- Create servers with a server software of your choice
- Automatically get suiting start script for your OS
- Run the servers in the background
- Attach to the servers' consoles
- List your servers and see their online status
- Get information about the required Java version for each server
- Delete servers with a confirmation to prevent accidental deletes

## Installation

### Linux

Run one of the following commands to get the latest version of `servu`.

**Install system-wide**

```sh
curl -s https://raw.githubusercontent.com/liqki/servu/main/scripts/install.sh | sudo bash -s
```

**Install for current user**

```sh
curl -s https://raw.githubusercontent.com/liqki/servu/main/scripts/install.sh | bash -s -- -u
```

_The default location is `$HOME/.local/bin`. The script will fail if the directory doesn't exist or is not in your system path._

**Install to specific directory**

```sh
curl -s https://raw.githubusercontent.com/liqki/servu/main/scripts/install.sh | bash -s -- -d <dir>
```

### Windows

Run the command below in a PowerShell terminal to install the latest version of `servu`.

```powershell
Set-ExecutionPolicy Unrestricted -Scope Process; iex (iwr "https://raw.githubusercontent.com/liqki/servu/main/scripts/install.ps1").Content
```

_Huge thanks to [Reemus](https://github.com/reemus-dev) for providing guidance on creating the install scripts. Check out his guide [here](https://reemus.dev/tldr/cli-install-script)._
