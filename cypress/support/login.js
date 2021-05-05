export const login = async () => {
  return cy.visit("http://localhost:3001/login", {
    onBeforeLoad(win) {
      console.log("onBeforeLoad");
      const invokeStub = cy.stub();

      invokeStub.withArgs("/get-config").returns({
        file:
          "U2FsdGVkX1/AAV0r1uyO3q1mWvTJ6hwNTPYIzZ0MBvEaRywIQAdAEc7b00aByYIqoV/KNvB10YbDnsUA/HuXTK2Xc83TyKPX5wPP7YsYl+0rH8Dolw92+tDFESw0eB9Z16W+NZEVG7bHyDI6XRPxCDNyEC1fxTpYe1zzLORejka1eMBu6xDpzGESryR5/GI/PC6k+mlcPPLvpleaWJWygMpZdlCG1ZOfkUnGkM7wS3fb/XAKGMbp4YkY5OwUv9JPBHhhv4BhOtdBnY7hCJiknw==",
        modifiedTime: 123456,
      });

      invokeStub.withArgs("/getNodeConfig").returns({
        blocks: 687000,
        initialblockdownload: false,
        provider: "Blockstream",
        connected: true,
      });
      invokeStub.withArgs("/bitcoin-network").returns(networks.bitcoin);
      invokeStub
        .withArgs("/historical-btc-price")
        .returns(HistoricalBtcPriceFixture);

      win.ipcRenderer = {
        invoke: invokeStub,
      };
    },
  });
};
