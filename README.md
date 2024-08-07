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

The currently installed version can be checked by running `servu -v`.

_Huge thanks to [Reemus](https://github.com/reemus-dev) for providing guidance on creating the install scripts. Check out his guide [here](https://reemus.dev/tldr/cli-install-script)._

## Usage

There are 8 commands available (6 on Windows).
| Command | Description | Arguments | Options | Windows? |
|----------|-|-|-|-|
| `create` | Create a new Minecraft server using a user prompt to select requirements | | | :white_check_mark: |
| `start/run` | Start a Minecraft server | `name` | `-d` `-s` | :white_check_mark: |
| `stop` | Stop a server that's running in the background (screen only) | `name` | |
| `attach` | Attach to a server console running in the background (screen only) | `name` | |
| `list` | List all Minecraft servers | | | :white_check_mark: |
| `cleanup` | Update your server list and remove deleted servers | | | :white_check_mark: |
| `delete` | Delete a Minecraft server | `name` | `-y` | :white_check_mark: |
| `update` | Check for updates and update servu | | `-y` | :white_check_mark: |

To view all available commands, run `servu -h`.

To get more information on the usage of a specific command, run `servu <command> -h`.

## Contributing

Contributions are welcome! If you have any suggestions or find any bugs, feel free to open an issue or submit a pull request. To contribute, follow these steps:

1. Fork the repository
2. Clone the repository
3. Install dependencies with `bun install`
4. Make your changes and test them using `bun start <command>`
5. Commit your changes
6. Push your changes to your fork
7. Open a pull request

## License

[MIT](https://choosealicense.com/licenses/mit/)
