import { get as getAppRootDir } from 'app-root-dir';
import { execFile } from 'child_process';
import { join, resolve as pathResolve, dirname } from 'path';
import { platform } from 'os';
import isPi from 'detect-rpi';

export const runCommand = async (command: string[]): Promise<string> => {
  return new Promise((resolve, reject) => {
    let hwiFile = 'hwi.exe';
    if (platform() === 'linux') hwiFile = 'HWI_LINUX';
    if (platform() === 'darwin') hwiFile = 'HWI_MAC';
    if (isPi()) hwiFile = 'HWI_PI';
    const appRootDir = getAppRootDir();

    const binariesPath = join(`${appRootDir}/build`, './HWIs');
    const pathToHwi = pathResolve(join(binariesPath, hwiFile));

    execFile(pathToHwi, command, (error, stdout, stderr) => {
      if (error) {
        reject(error.message);
      }
      resolve(stdout);
    });
  });
};
