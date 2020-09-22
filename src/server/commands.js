const runCommand = require('./runCommand');

const enumerate = async () => {
  return await runCommand(['enumerate']);
}

const getMasterXPub = async (deviceType, devicePath, testnet) => {
  if (testnet)
    return await runCommand(['-t', deviceType, '-d', devicePath, '--testnet', 'getmasterxpub'])
  else
    return await runCommand(['-t', deviceType, '-d', devicePath, 'getmasterxpub'])
}

const getXPub = async (deviceType, devicePath, path, testnet) => {
  if (testnet)
    return await runCommand(['-t', deviceType, '-d', devicePath, '--testnet', 'getxpub', path])
  else
    return await runCommand(['-t', deviceType, '-d', devicePath, 'getxpub', path])
}

const signtx = async (deviceType, devicePath, psbt, testnet) => {
  if (testnet)
    return await runCommand(['-t', deviceType, '-d', devicePath, '--testnet', 'signtx', psbt])
  else
    return  await runCommand(['-t', deviceType, '-d', devicePath, 'signtx', psbt])
}

const displayaddress = async (deviceType, devicePath, path, testnet) => {
  if (testnet)
    return await runCommand(['-t', deviceType, '-d', devicePath, '--testnet', 'displayaddress', path])
  else
    return await runCommand(['-t', deviceType, '-d', devicePath, 'displayaddress', path])
}

const promptpin = async (deviceType, devicePath) => {
  return await runCommand(['-t', deviceType, '-d', devicePath, 'promptpin'])
}

const sendpin = async (deviceType, devicePath, pin) => {
  return await runCommand(['-t', deviceType, '-d', devicePath, 'sendpin', pin])
}

module.exports = {
  enumerate,
  getMasterXPub,
  getXPub,
  signtx,
  displayaddress,
  promptpin,
  sendpin
}