import runCommand from "./runCommand";

export const enumerate = async () => {
  return await runCommand(["enumerate"]);
};

export const getMasterXPub = async (
  deviceType: string,
  devicePath: string,
  testnet: boolean
) => {
  if (testnet)
    return await runCommand([
      "-t",
      deviceType,
      "-d",
      devicePath,
      "--testnet",
      "getmasterxpub",
    ]);
  else
    return await runCommand([
      "-t",
      deviceType,
      "-d",
      devicePath,
      "getmasterxpub",
    ]);
};

export const getXPub = async (
  deviceType: string,
  devicePath: string,
  path: string,
  testnet: boolean
) => {
  if (testnet)
    return await runCommand([
      "-t",
      deviceType,
      "-d",
      devicePath,
      "--testnet",
      "getxpub",
      path,
    ]);
  else
    return await runCommand([
      "-t",
      deviceType,
      "-d",
      devicePath,
      "getxpub",
      path,
    ]);
};

export const signtx = async (
  deviceType: string,
  devicePath: string,
  psbt: string,
  testnet: boolean
) => {
  if (testnet)
    return await runCommand([
      "-t",
      deviceType,
      "-d",
      devicePath,
      "--testnet",
      "signtx",
      psbt,
    ]);
  else
    return await runCommand([
      "-t",
      deviceType,
      "-d",
      devicePath,
      "signtx",
      psbt,
    ]);
};

export const displayaddress = async (
  deviceType: string,
  devicePath: string,
  path: string,
  testnet: boolean
) => {
  if (testnet)
    return await runCommand([
      "-t",
      deviceType,
      "-d",
      devicePath,
      "--testnet",
      "displayaddress",
      path,
    ]);
  else
    return await runCommand([
      "-t",
      deviceType,
      "-d",
      devicePath,
      "displayaddress",
      path,
    ]);
};

export const promptpin = async (deviceType: string, devicePath: string) => {
  return await runCommand(["-t", deviceType, "-d", devicePath, "promptpin"]);
};

export const sendpin = async (
  deviceType: string,
  devicePath: string,
  pin: string
) => {
  return await runCommand(["-t", deviceType, "-d", devicePath, "sendpin", pin]);
};
