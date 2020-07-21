const runCommand = require('./runCommand');

const enumerate = async () => {
  return await runCommand(['enumerate']);
}

const getMasterXPub = async (deviceType, devicePath) => {
  return await runCommand(['-t', deviceType, '-d', devicePath, 'getmasterxpub'])
}

const getXPub = async (deviceType, devicePath, path) => {
  return await runCommand(['-t', deviceType, '-d', devicePath, 'getxpub', path])
}

const signtx = async (deviceType, devicePath, psbt) => {
  return await runCommand(['-t', deviceType, '-d', devicePath, 'signtx', psbt])
}

const displayaddress = async (deviceType, devicePath, path) => {
  return await runCommand(['-t', deviceType, '-d', devicePath, 'getxpub', path])
}

module.exports = {
  enumerate,
  getMasterXPub,
  getXPub,
  signtx,
  displayaddress
}