import { execFile } from 'child_process';
import { join, resolve as pathResolve } from 'path';
import { platform } from 'os';

export const runCommand = async (command: string[]): Promise<string> => {
  return new Promise((resolve, reject) => {
    let hwiFile = 'hwi.exe';
    if (platform() === 'linux') hwiFile = 'HWI_LINUX';
    if (platform() === 'darwin') hwiFile = 'HWI_MAC';

    const binariesPath = join(__dirname, '..', '..', '..', './HWIs');
    const pathToHwi = pathResolve(join(binariesPath, hwiFile));

    // uncomment when testing newer versions of HWI
    // const pathToHwi = resolve(join(__dirname, '..', '..', '..', 'HWI', 'hwi.py'));
    execFile(pathToHwi, command, (error, stdout, stderr) => {
      if (error) {
        reject(error.message);
      }
      resolve(stdout);
    });
  });
};
