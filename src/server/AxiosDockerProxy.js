const axios = require("axios");

class AxiosDockerProxy {
  constructor(axiosConfig) {
    this.axios = axios.create(axiosConfig);
  }

  async getBlockchainInfo() {
    const data = await (await this.axios.get(`/getBlockchainInfo`)).data;
    console.log("data: ", data);
    return data;
  }

  async getAccountData(config) {
    const data = await (await this.axios.post(`/account-data`, { config }))
      .data;
    console.log("data: ", data);
    return data;
  }
}

module.exports = AxiosDockerProxy;
