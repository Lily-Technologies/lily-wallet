# Development

This document describes the process for running this application on your local computer.

## Getting started

Lily Wallet is a monorepo consisting of a frontend React application, an Electron app, an Express server, and some shared functions and types.

The frontend runs either within the Electron application or against the Express server depending on whether you are running Lily Wallet as a desktop application or web app like Umbrel.

There are a few different scripts in the root package.json file that will orchestrate getting your development environment up and running.

```
git clone https://github.com/Lily-Technologies/lily-wallet.git
cd lily-wallet
npm install

npm run build:types
npm run build:shared-server

npm run build:electron

npm run dev:frontend:electron
# in a different terminal window (CMD + D on Mac), run the following command:
npm run dev:electron
```

An Electron window should open up. You now have a running desktop application!

When you're ready to stop your local application, type <kbd>Ctrl</kbd>+<kbd>C</kbd> in your terminal window.
