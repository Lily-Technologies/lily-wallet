const config = {
  "name": "",
  "version": "0.0.1",
  "backup_options": {
    "gdrive": true
  },
  "wallets": [
    {
      "id": "f895033a-928a-4491-a7ac-c5876de0956e",
      "name": "f895033a-928a-4491-a7ac-c5876de0956e",
      "network": "mainnet",
      "addressType": "P2WSH",
      "quorum": {
        "requiredSigners": 1,
        "totalSigners": 1
      },
      "xpub": "xpub661MyMwAqRbcFky7X5TGn1h1iH8tomYDxMYruHmhYk9epJU92PQ4a4zC6YVx2qzh8Dd5V81eSpkEL1GFWKx5SU5FYiEJW7HnRZ9GATQn38Q",
      "xprv": "xprv9s21ZrQH143K3GteR3vGQskHAFJQQJpNb8dG6uN5zQcfwW8zUr5p2GfiFFxLb7T9o8jmX6Z3HdhsdswUk56xbBq3M9aE6etzcsrrCHFx9z6",
      "parentFingerprint": {
        "type": "Buffer",
        "data": [
          210,
          156,
          134,
          194
        ]
      }
    }
  ],
  "vaults": [
    {
      "id": "09849cf6-b2e9-4986-8a6d-8de02be791b5",
      "name": "09849cf6-b2e9-4986-8a6d-8de02be791b5",
      "network": "mainnet",
      "addressType": "P2WSH",
      "quorum": {
        "requiredSigners": 2,
        "totalSigners": 3
      },
      "extendedPublicKeys": [
        {
          "id": "e0fb7254-4c70-4289-9e71-0b3ebd1cc044",
          "parentFingerprint": "9130c3d6",
          "network": "mainnet",
          "bip32Path": "m/0",
          "xpub": "xpub6F1TMXpKfN5hRMdDUwSb9qD6LQmx2LTEbNtTj4nkFJte9GN14aFbqpup5AW7m9YhnYiTvEc1PqkrXkDY4gzJ95tNWKUATL6hD2AT641pSLE"
        },
        {
          "id": "ad226ef3-0aa7-4620-8d34-64e8110b9562",
          "parentFingerprint": "4f60d1c9",
          "network": "mainnet",
          "bip32Path": "m/0",
          "xpub": "xpub6F2wuvSo8gSRjE9JsMgSva9cDZGa2Hh9SEJ9yczCLd1q2SRFV6N4vRUKFoecbatfhgZcG5rNwTxygNLoPrKpjRt94czCzQQPnoVY1RauiL6"
        },
        {
          "id": "e532eeae-b7a2-43a4-889f-6f3b7e4d7dc1",
          "parentFingerprint": "34ecf56b",
          "network": "mainnet",
          "bip32Path": "m/0",
          "xpub": "xpub6FCzsnvwxusaXu8rxxn1XVKXSKFKjYrynid9ntEJ1Qc18Vi6eqGSkP6MJdEtDXCGqNNCGdytUJdLSucPxnyHdJYJKK6YMcTgULAxvrQYm5J"
        }
      ]
    }
  ],
  "keys": [
    {
      "id": "e0fb7254-4c70-4289-9e71-0b3ebd1cc044",
      "parentFingerprint": "9130c3d6",
      "network": "mainnet",
      "bip32Path": "m/0",
      "xpub": "xpub6F1TMXpKfN5hRMdDUwSb9qD6LQmx2LTEbNtTj4nkFJte9GN14aFbqpup5AW7m9YhnYiTvEc1PqkrXkDY4gzJ95tNWKUATL6hD2AT641pSLE"
    },
    {
      "id": "ad226ef3-0aa7-4620-8d34-64e8110b9562",
      "parentFingerprint": "4f60d1c9",
      "network": "mainnet",
      "bip32Path": "m/0",
      "xpub": "xpub6F2wuvSo8gSRjE9JsMgSva9cDZGa2Hh9SEJ9yczCLd1q2SRFV6N4vRUKFoecbatfhgZcG5rNwTxygNLoPrKpjRt94czCzQQPnoVY1RauiL6"
    },
    {
      "id": "e532eeae-b7a2-43a4-889f-6f3b7e4d7dc1",
      "parentFingerprint": "34ecf56b",
      "network": "mainnet",
      "bip32Path": "m/0",
      "xpub": "xpub6FCzsnvwxusaXu8rxxn1XVKXSKFKjYrynid9ntEJ1Qc18Vi6eqGSkP6MJdEtDXCGqNNCGdytUJdLSucPxnyHdJYJKK6YMcTgULAxvrQYm5J"
    }
  ]
}

export default config;