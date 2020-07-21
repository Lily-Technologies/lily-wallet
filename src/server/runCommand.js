const { execFile, exec } = require("child_process");
const log = require("electron-log");
const path = require("path");
var os = require("os");
const { app } = require('electron');


const runCommand = async (command) => {
  return new Promise((resolve, reject) => {
    const isPackaged =
      process.mainModule.filename.indexOf('app.asar') !== -1;

    let hwiFile = "hwi.exe";
    if (os.platform() === "linux") hwiFile = "HWI_LINUX";
    if (os.platform() === "darwin") hwiFile = "HWI_MAC";

    const binariesPath = path.join(__dirname, '..', '..', './HWIs');

    const pathToHwi = path.resolve(path.join(binariesPath, hwiFile));

    execFile(pathToHwi, command, (error, stdout, stderr) => {
      if (error) {
        log.info("error: ", error);
        reject(error);
      }
      resolve(stdout);
    });
  });
};

module.exports = runCommand;