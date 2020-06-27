const { exec } = require("child_process");
const log = require("electron-log");
const path = require("path");
var os = require("os");

const runCommand = async (command) => {
  return new Promise((resolve, reject) => {
    let hwiFile = "HWI.exe";

    console.log(os.platform());

    if (os.platform() === "linux") hwiFile = "HWI_LINUX";
    if (os.platform() === "darwin") hwiFile = "HWI_MAC";

    // const pathToHwi = path.resolve(__dirname, 'HWI'); // for mac, change when building
    // const pathToHwi = path.resolve(__dirname, 'hwi.exe'); // for windows, change when building
    const pathToHwi = path.resolve(__dirname, hwiFile); // for mac, change when building
    exec(`${pathToHwi} ${command}`, (error, stdout, stderr) => {
      if (error) {
        log.info("error: ", error);
        reject(error);
      }
      resolve(stdout);
    });
  });
};

module.exports = runCommand;
