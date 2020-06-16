const { exec } = require("child_process");
const log = require('electron-log');
const path = require('path');

const runCommand = async (command) => {
  return new Promise((resolve, reject) => {
    log.info('__dirname: ', __dirname);
    log.info('command: ', command);
    exec(`ls`, (error, stdout, stderr) => {
      log.info('ls stdout: ', stdout);
    });

    console.log('what is path? ', path);
    console.log('command path: ', path.resolve(__dirname, 'hwi'));
    const pathToHwi = path.resolve(__dirname, 'hwi');
    exec(`${pathToHwi} ${command}`, (error, stdout, stderr) => {
      if (error) {
        log.info('error: ', error);
        reject(error);
      }
      log.info('stdout: ', stdout);
      resolve(stdout);
    });
  });
}

module.exports = runCommand;

// const { exec } = require("child_process");
// const log = require('electron-log');
// const path = require('path');
// const { PythonShell } = require('python-shell');

// const runCommand = async (command) => {
//   return new Promise((resolve, reject) => {
//     log.info('__dirname: ', __dirname);
//     log.info('command: ', command)
//     log.info("path.join(__dirname, '/HWI/hwi.py'): ", path.join(__dirname, '/HWI/hwi.py'));
//     PythonShell.run(`${path.join(__dirname, '/HWI/hwi.py')}`, { args: command }, (error, stdout) => {
//       if (error) {
//         log.info('error: ', error);
//         reject(error);
//       }
//       log.info('stdout: ', stdout);
//       resolve(stdout);
//     });
//   });
// }

// module.exports = runCommand;