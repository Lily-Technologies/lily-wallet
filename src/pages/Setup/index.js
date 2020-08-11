import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { AES } from 'crypto-js';
import moment from 'moment';
import { bip32 } from "bitcoinjs-lib";
import bs58check from 'bs58check';
import { generateMnemonic, mnemonicToSeed } from "bip39";
import { v4 as uuidv4 } from 'uuid';

import { createConfigFile, createColdCardBlob, downloadFile, getUnchainedNetworkFromBjslibNetwork } from '../../utils/files';
import { black } from '../../utils/colors';

import StepGroups from './Steps';
import SelectAccountScreen from './SelectAccountScreen';
import InputPasswordScreen from './InputPasswordScreen';
import InputNameScreen from './InputNameScreen';
import NewVaultScreen from './NewVaultScreen';
import SuccessScreen from './SuccessScreen';
import NewWalletScreen from './NewWalletScreen';

const zpubToXpub = (zpub) => {
  const zpubRemovedPrefix = zpub.slice(4);
  const xpubBuffer = Buffer.concat([Buffer.from('0488b21e', 'hex'), zpubRemovedPrefix]);
  const xpub = bs58check.encode(xpubBuffer);
  return xpub
}

const Setup = ({ config, setConfigFile, currentBitcoinNetwork }) => {
  const [setupOption, setSetupOption] = useState(0);
  const [step, setStep] = useState(0);
  const [accountName, setAccountName] = useState('');
  const [importedDevices, setImportedDevices] = useState([]);
  const [availableDevices, setAvailableDevices] = useState([]);
  const [errorDevices, setErrorDevices] = useState([]);
  const [password, setPassword] = useState('');
  const [walletMnemonic, setWalletMnemonic] = useState(null);

  useEffect(() => {
    setWalletMnemonic(generateMnemonic(256));
  }, []);

  document.title = `Create Files - Lily Wallet`;

  const importDevice = async (device, index) => {
    try {
      const response = await window.ipcRenderer.invoke('/xpub', {
        deviceType: device.type,
        devicePath: device.path,
        path: `m/48'/0'/0'/2'` // we are assuming BIP48 P2WSH wallet
      });

      setImportedDevices([...importedDevices, { ...device, ...response }]);
      availableDevices.splice(index, 1);
      if (errorDevices.includes(device.fingerprint)) {
        const errorDevicesCopy = [...errorDevices];
        errorDevicesCopy.splice(errorDevices.indexOf(device.fingerprint), 1);
        setErrorDevices(errorDevicesCopy);
      }
      setAvailableDevices([...availableDevices]);

      if (importedDevices.length === 2) { // we have to use the old value of importedDevice since the new render hasn't hapened yet
        setStep(3);
      }
    } catch (e) {
      const errorDevicesCopy = [...errorDevices];
      errorDevicesCopy.push(device.fingerprint);
      setErrorDevices([...errorDevicesCopy])
    }
  }

  const importDeviceFromFile = (parsedFile) => {
    const zpub = bs58check.decode(parsedFile.p2wsh);
    const xpub = zpubToXpub(zpub);

    const newDevice = {
      type: 'coldcard',
      fingerprint: parsedFile.xfp,
      xpub: xpub
    }

    setImportedDevices([...importedDevices, newDevice])
  }

  const importMultisigWalletFromFile = (parsedFile) => {
    const numPubKeys = Object.keys(parsedFile).filter((key) => key.startsWith('x')).length // all exports start with x
    const devicesFromFile = [];

    for (let i = 1; i < numPubKeys + 1; i++) {
      const zpub = bs58check.decode(parsedFile[`x${i}/`].xpub);
      const xpub = zpubToXpub(zpub);

      const newDevice = {
        type: parsedFile[`x${i}/`].hw_type,
        fingerprint: parsedFile[`x${i}/`].label.substring(parsedFile[`x${i}/`].label.indexOf('Coldcard ') + 'Coldcard '.length),
        xpub: xpub
      };

      devicesFromFile.push(newDevice);
    }
    setImportedDevices([...importedDevices, ...devicesFromFile])
  }

  const exportSetupFiles = () => {
    if (setupOption === 2) {
      exportSetupFilesSingleSig()
    } else {
      exportSetupFilesMultisig()
    }
  }

  const exportSetupFilesSingleSig = async () => {
    const contentType = "text/plain;charset=utf-8;";
    const configObject = { ...config };
    configObject.isEmpty = false;

    // taken from BlueWallet so you can import and use on mobile
    const seed = await mnemonicToSeed(walletMnemonic);
    const root = bip32.fromSeed(seed, currentBitcoinNetwork);
    const path = "m/84'/0'/0'";
    const child = root.derivePath(path).neutered();
    const xpubString = child.toBase58();
    const xprvString = root.derivePath(path).toBase58();

    const newKey = {
      id: uuidv4(),
      created_at: Date.now(),
      name: accountName,
      network: getUnchainedNetworkFromBjslibNetwork(currentBitcoinNetwork),
      addressType: "P2WSH",
      quorum: { requiredSigners: 1, totalSigners: 1 },
      xpub: xpubString,
      xprv: xprvString,
      mnemonic: walletMnemonic,
      parentFingerprint: root.fingerprint,
    };

    configObject.wallets.push(newKey);

    configObject.keys.push(newKey)

    const encryptedConfigObject = AES.encrypt(
      JSON.stringify(configObject),
      password
    ).toString();

    const encryptedConfigFile = new Blob(
      [decodeURIComponent(encodeURI(encryptedConfigObject))],
      { type: contentType }
    );
    downloadFile(
      encryptedConfigFile,
      `lily_wallet_config-${moment().format('MMDDYY-hhmmss')}.txt`
    );

    setConfigFile(configObject);
  };

  const exportSetupFilesMultisig = () => {
    const contentType = "text/plain;charset=utf-8;";

    const ccFile = createColdCardBlob(accountName, importedDevices);
    const configObject = createConfigFile(importedDevices, accountName, config, currentBitcoinNetwork);
    const encryptedConfigObject = AES.encrypt(JSON.stringify(configObject), password).toString();
    const encryptedConfigFile = new Blob([decodeURIComponent(encodeURI(encryptedConfigObject))], { type: contentType });

    downloadFile(ccFile, `${moment().format('MMDDYYYY')}-lily-coldcard-file.txt`);
    // KBC-TODO: electron-dl bug requires us to wait for the first file to finish downloading before downloading the second
    // this should be fixed somehow
    setTimeout(() => {
      downloadFile(encryptedConfigFile, `lily_wallet_config-${moment().format('MMDDYY-hhmmss')}.txt`)
    }, 500);
    setConfigFile(configObject);
  }

  let screen = null;

  switch (step) {
    case 0:
      screen = <SelectAccountScreen
        setSetupOption={setSetupOption}
        setStep={setStep}
        config={config} />;
      break;
    case 1:
      screen = <InputNameScreen
        setupOption={setupOption}
        config={config}
        setStep={setStep}
        accountName={accountName}
        setAccountName={setAccountName} />;
      break;
    case 2:
      if (setupOption === 2) {
        screen = <NewWalletScreen
          walletMnemonic={walletMnemonic}
          setWalletMnemonic={setWalletMnemonic}
          setStep={setStep}
        />;
      } else {
        screen = <NewVaultScreen
          config={config}
          setStep={setStep}
          importMultisigWalletFromFile={importMultisigWalletFromFile}
          importDeviceFromFile={importDeviceFromFile}
          importDevice={importDevice}
          importedDevices={importedDevices}
          availableDevices={availableDevices}
          errorDevices={errorDevices}
          setAvailableDevices={setAvailableDevices}
        />;
      }
      break;
    case 3:
      screen = <InputPasswordScreen
        password={password}
        setPassword={setPassword}
        exportSetupFiles={exportSetupFiles}
        setStep={setStep}
      />;
      break;
    case 4:
      screen = <SuccessScreen
        exportSetupFiles={exportSetupFiles}
      />;
      break;
    default:
      screen = <div>Unexpected error</div>;
  }

  return (
    <Wrapper step={step}>
      {step > 0 && <StepGroups step={step} />}
      {screen}
    </Wrapper>
  )
}

const Wrapper = styled.div`
  // padding: 1em;
  text-align: left;
  font-family: 'Montserrat', sans-serif;
  color: ${black};
  // margin-top: -1px;
  align-items: center;
  display: flex;
  flex: 1;
  justify-content: ${p => p.step === 0 ? 'center' : 'flex-start'};
  flex-direction: column;
  // padding-top: 50px;
`;

export default Setup;