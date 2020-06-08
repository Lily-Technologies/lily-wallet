const { exec } = require("child_process");

const runCommand = async (command) => {
  return new Promise((resolve, reject) => {
    console.log('__dirname + `/HWI/hwi.py: ', __dirname + `/HWI/hwi.py`);
    exec(__dirname + `/HWI/hwi.py ${command}`, (error, stdout, stderr) => {
      if (error) {
        reject(error);
      }
      console.log('stdout: ', stdout);
      resolve(stdout);
    });
  });
}

module.exports = runCommand;