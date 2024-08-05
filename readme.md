# ServU

## ToDo

- [x] create server command
- [x] validate minecraft version
- [x] automatically create eula.txt
- [x] prompts using inquirer
- [x] own local storage implementation
- [x] download server software for vanilla, paper and fabric
- [x] fixed download (files were corrupt since download function wasn't awaited)
- [ ] download server software for spigot and forge
- [ ] find download api / manually assign version download links
- [x] delete key from local storage
- [x] update local storage when server directory does not exist anymore => cleanup command
- [x] server list command
- [x] add online status to server list (for screen sessions)
- [x] run server command using child_process => windows done
- [x] run server command using child_process => linux also add ability to use screen
- [ ] ability to reenter console after server is started using screen => command currently always failing
- [x] stop command for screen session
- [x] java warning if not installed / wrong version
- [x] fix: java version not detected properly
- [x] automatically create suiting start script for os (.bat, .sh) => windows done, linux: create appropiate start.sh
- [x] ability to use screen on linux
- [x] hook to server console
- [x] delete server command
- [x] instructions on installing java if not present
- [x] migrate to bun
- [ ] github action to build single executable using bun build --compile
- [ ] install script for linux and windows
- [ ] readme
