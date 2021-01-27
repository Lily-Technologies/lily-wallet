const fs = require("fs");
const readline = require("readline");
const { Client } = require("bitcoin-simple-rpc");
const { SocksProxyAgent } = require("socks-proxy-agent");

const getBitcoinDirectory = () => {
  if (process.platform === "darwin") {
    return `${process.env.HOME}/Library/Application Support/Bitcoin`;
  } else if (process.platform === "win32") {
    return `${process.env.APPDATA}/Bitcoin`;
  } else {
    return `${process.env.HOME}/.bitcoin`;
  }
};

const getRpcInfo = async () => {
  return new Promise((resolve, reject) => {
    const bitcoinConfFileLocation = `${getBitcoinDirectory()}/bitcoin.conf`;
    if (fs.existsSync(bitcoinConfFileLocation)) {
      const readInterface = readline.createInterface({
        input: fs.createReadStream(bitcoinConfFileLocation),
        // output: process.stdout,
        console: false,
      });

      const config = {};

      readInterface.on("line", function (line) {
        const trimmedLine = line.trim();
        if (trimmedLine.length && !trimmedLine.startsWith("#")) {
          const [key, value] = trimmedLine.split("=");
          if (key && value) {
            config[key] = value;
          }
        }
      });

      readInterface.on("close", () => {
        resolve(config);
      });
    } else {
      reject("No bitcoin.conf file found");
    }
  });
};

const getClientFromNodeConfig = (nodeConfig) => {
  if (nodeConfig.baseURL.includes(".onion")) {
    const proxyOptions = "socks5h://127.0.0.1:9050";
    const httpsAgent = new SocksProxyAgent(proxyOptions);
    nodeConfig.httpAgent = httpsAgent;
  }
  return new Client(nodeConfig);
};

module.exports = {
  getRpcInfo,
  getClientFromNodeConfig,
};
