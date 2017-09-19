# IMPORTANT: I'm no longer actively working on this project
I recently started using [beancount/fava](https://github.com/beancount/fava) instead of ledger and I'm probably not going to spend much time on this project.

If you have improvements I'll try to merge and publish pull requests.
If you're interested in maintaining the project please get in touch and we can figure out the best way to work together or to transfer it to you.

# Content of this repository
This repository contains both the code for the client and server side of the Visual Studio Code extension. Their directories contain the code and more details.

# How to develop
The process is a bit more convoluted than I'd like, anyway here are the steps you'll need to follow to get something running:
 * `npm install` in both the `client` and `server` directories
 * open two Visual Studio Code windows, one for the client and one for the server
 * in the server's window, hit `CTRL + Shift + B`. It will build the server and copy into the client folder
 * in the client folder, hit `CTRL + Shift + B` to build and then `F5` when you want to launch a new Visual Studio Code window with a debugger attached.
