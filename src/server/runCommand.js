const { execFile } = require("child_process");
const path = require("path");
var os = require("os");
const { app } = require("electron");

const runCommand = async (command) => {
  return new Promise((resolve, reject) => {
    let hwiFile = "hwi.exe";
    if (os.platform() === "linux") hwiFile = "HWI_LINUX";
    if (os.platform() === "darwin") hwiFile = "HWI_MAC";

    const binariesPath = path.join(__dirname, "..", "..", "./HWIs");
    const pathToHwi = path.resolve(path.join(binariesPath, hwiFile));

    // uncomment when testing newer versions of HWI
    // const pathToHwi = path.resolve(path.join(__dirname, '..', '..', '..', 'HWI', 'hwi.py'));
    execFile(pathToHwi, command, (error, stdout, stderr) => {
      if (error) {
        reject(error);
      }
      resolve(stdout);
    });
  });
};

module.exports = runCommand;
