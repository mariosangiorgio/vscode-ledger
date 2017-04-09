This repository contains both the code for the client and server side of the Visual Studio Code extension. Their directories contain the code and more details.

# How to develop
The process is a bit more convoluted than I'd like, anyway here are the steps you'll need to follow to get something running:
 * `npm install` in both the `client` and `server` directories
 * open two Visual Studio Code windows, one for the client and one for the server
 * in the server's window, hit `CTRL + Shift + B`. It will build the server and copy into the client folder
 * in the client folder, hit `CTRL + Shift + B` to build and then `F5` when you want to launch a new Visual Studio Code window with a debugger attached.
