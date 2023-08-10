import { get as getAppRootDir } from 'app-root-dir';
import { execFile } from 'child_process';
import { join, resolve as pathResolve, dirname } from 'path';
import { platform } from 'os';
import isPi from 'detect-rpi';

export const runCommand = async (command: string[], bitgo?: boolean): Promise<string> => {
  return new Promise((resolve, reject) => {
    let hwiFile = 'hwi.exe';
    if (bitgo) hwiFile = 'HWI_BITGO.exe';
    if (platform() === 'linux') hwiFile = 'HWI_LINUX'; // BITGO not supported
    if (platform() === 'darwin') hwiFile = 'HWI_MAC';
    if (platform() === 'darwin' && bitgo) hwiFile = 'HWI_MAC_BITGO';
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
