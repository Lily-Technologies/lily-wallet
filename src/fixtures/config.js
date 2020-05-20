const config = {
  name: "",
  network: "testnet",
  backup_options: {
    gdrive: true
  },
  wallets: [
    {
      id: "eeabc8a8-4079-4848-9b97-ef7404bb731c",
      name: "eeabc8a8-4079-4848-9b97-ef7404bb731c",
      addressType: "P2WSH",
      quorum: {
        requiredSigners: 1,
        totalSigners: 1
      },
      xpub: "tpubD6NzVbkrYhZ4XkBzRhfoEy3RQUtCwqeLxmNokBvSPYyBgkKk5UicwSUosVSK88igvDv77MSxj1xgtcXK2scd6wNnzxdXJznTajSXaw2iEmX",
      xprv: "tprv8ZgxMBicQKsPeHACY41CqZPJqTNGnWTSPTn2Tft8yHAnrG4yT5u2kwrwhKjvTQZ9cZxAt8gt3K4mrFh3d6Jwn8BCSjWtuJS91WDh7bFZm5N",
      parentFingerprint: "0x00"
    }
  ],
  vaults: [
    {
      id: "bcabbe2d-779f-40d4-bcd8-a203a4bafac2",
      name: "2b030782-21a7-442c-80ca-09833c0dc609",
      addressType: "P2WSH",
      quorum: {
        requiredSigners: 2,
        totalSigners: 3
      },
      extendedPublicKeys: [
        {
          parentFingerprint: "9130c3d6",
          bip32Path: "m/0",
          xpub: "tpubDDv6Az73JkvvPQPFdytkRrizpdxWtHTE6gHywCRqPu3nz2YdHDG5AnbzkJWJhtYwEJDR3eENpQQZyUxtFFRRC2K1PEGdwGZJYuji8QcaX4Z",
          method: "xpub"
        },
        {
          parentFingerprint: "34ecf56b",
          bip32Path: "m/0",
          xpub: "tpubDECB21DPAjBvUtqSCGWHJrbh6nSg9JojqmoMBuS5jGKTFvYJb784Pu5hwq8vSpH6vkk3dZmjA3yR7mGbrs3antkL6BHVHAyjPeeJyAiVARA",
          method: "xpub"
        },
        {
          parentFingerprint: "4f60d1c9",
          bip32Path: "m/0",
          xpub: "tpubDFR1fvmcdWbMMDn6ttHPgHi2Jt92UkcBmzZ8MX6QuoupcDhY7qoKsjSG2MFvN66r2zQbZrdjfS6XtTv8BjED11hUMq3kW2rc3CLTjBZWWFb",
          method: "xpub"
        }
      ]
    }
  ],
  keys: [
    {
      parentFingerprint: "9130c3d6",
      bip32Path: "m/0",
      xpub: "tpubDDv6Az73JkvvPQPFdytkRrizpdxWtHTE6gHywCRqPu3nz2YdHDG5AnbzkJWJhtYwEJDR3eENpQQZyUxtFFRRC2K1PEGdwGZJYuji8QcaX4Z",
      method: "xpub"
    },
    {
      parentFingerprint: "34ecf56b",
      bip32Path: "m/0",
      xpub: "tpubDECB21DPAjBvUtqSCGWHJrbh6nSg9JojqmoMBuS5jGKTFvYJb784Pu5hwq8vSpH6vkk3dZmjA3yR7mGbrs3antkL6BHVHAyjPeeJyAiVARA",
      method: "xpub"
    },
    {
      parentFingerprint: "4f60d1c9",
      bip32Path: "m/0",
      xpub: "tpubDFR1fvmcdWbMMDn6ttHPgHi2Jt92UkcBmzZ8MX6QuoupcDhY7qoKsjSG2MFvN66r2zQbZrdjfS6XtTv8BjED11hUMq3kW2rc3CLTjBZWWFb",
      method: "xpub"
    }
  ]
}


export default config;